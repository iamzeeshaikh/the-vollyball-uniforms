// Orders from /checkout/. Every line is re-priced from src/data/products.ts, so a tampered
// browser can never change what an order costs. Payment is a PayPal invoice only (sports
// rule). Spam signals only label the email (owner's rule: never drop a lead).
export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { products, minQty, MAX_QTY, SHIP_COUNTRIES } from '../../data/products';
import { spamReasons } from '../../data/spam.js';

const SITE = 'https://thevolleyballuniforms.com';
const MAX_FILE = 4 * 1024 * 1024;
const ALLOWED_EXT = /\.(pdf|ai|eps|svg|png|jpe?g|zip|csv|xlsx)$/i;
const FIELDS = ['name', 'email', 'phone', 'company', 'address1', 'address2', 'city', 'region', 'postal', 'country', 'notes', 'items', 'ts', 'website'] as const;
const REQUIRED = ['name', 'email', 'phone', 'address1', 'city', 'postal'] as const;
const money = (n: number) => `$${n.toFixed(2)}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();
const json = (status: number, body: object) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now); hits.set(ip, list);
  return list.length > 8;
}

function orderRef() {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return `TVU-${ymd}-${Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => abc[b % abc.length]).join('')}`;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const origin = request.headers.get('origin');
  if (origin) {
    const host = (() => { try { return new URL(origin).host; } catch { return ''; } })();
    if (!['thevolleyballuniforms.com', 'www.thevolleyballuniforms.com', 'localhost:4321'].includes(host) && !host.endsWith('.vercel.app')) return json(403, { ok: false, error: 'Invalid request origin' });
  }
  let form: FormData;
  try { form = await request.formData(); } catch { return json(400, { ok: false, error: 'Could not read the order' }); }
  const v = Object.fromEntries(FIELDS.map((k) => [k, String(form.get(k) ?? '').trim().slice(0, k === 'items' ? 8000 : 3000)])) as Record<(typeof FIELDS)[number], string>;
  if (REQUIRED.some((k) => !v[k]) || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(v.email)) return json(422, { ok: false, error: 'Please fill in every required field' });
  // Old checkout pages sent no country field: those were US-only.
  const country = SHIP_COUNTRIES.find((c) => c.code === (v.country || 'US'));
  if (!country) return json(422, { ok: false, error: 'We ship to the US, UK, Canada and Australia; request a quote for other countries' });
  if (country.code !== 'GB' && !v.region) return json(422, { ok: false, error: 'Please fill in every required field' });

  // Never trust the browser's prices: rebuild every line from the catalogue.
  let raw: unknown = [];
  try { raw = JSON.parse(v.items || '[]'); } catch {}
  const lines = (Array.isArray(raw) ? raw : []).slice(0, 30)
    .map((l: any) => ({ p: products.find((x) => x.slug === String(l?.slug ?? '')), qty: Math.floor(Number(l?.qty)) }))
    .filter((l) => l.p && l.qty >= minQty(l.p) && l.qty <= MAX_QTY)
    .map((l) => ({ name: l.p!.name, unit: l.p!.priceUnit, price: l.p!.price, url: `${SITE}/${l.p!.slug}/`, qty: l.qty, total: l.qty * l.p!.price }));
  if (!lines.length) return json(422, { ok: false, error: 'Your order is empty' });
  const total = lines.reduce((s, l) => s + l.total, 0);
  if (limited(clientAddress || request.headers.get('x-forwarded-for') || 'unknown')) return json(429, { ok: false, error: 'Too many orders from this connection, please call us' });

  const spam: string[] = [];
  if (v.website) spam.push('hidden field filled');
  const attachments: { filename: string; content: Buffer }[] = [];
  const file = form.get('artwork');
  if (file && typeof file === 'object' && 'arrayBuffer' in file && file.size > 0) {
    if (file.size <= MAX_FILE && ALLOWED_EXT.test(file.name)) attachments.push({ filename: file.name.replace(/[^\w.\- ]+/g, '_').slice(-120), content: Buffer.from(await file.arrayBuffer()) });
    else spam.push(`attachment not accepted (${file.name.slice(0, 60)})`);
  }
  spam.push(...spamReasons({ names: [v.name], email: v.email, phone: v.phone, message: v.notes, fields: { Team: v.company }, sentAt: v.ts }));
  const spamLine = spam.length ? `Spam check: ${spam.join('; ')}` : '';

  const smtpHost = import.meta.env.SMTP_HOST, smtpUser = import.meta.env.SMTP_USER, smtpPass = import.meta.env.SMTP_PASS;
  const smtpTo = import.meta.env.SMTP_TO ?? smtpUser;
  if (!smtpHost || !smtpUser || !smtpPass) { console.error('order: SMTP not configured'); return json(503, { ok: false, error: 'We could not send your order' }); }
  const mailer = nodemailer.createTransport({ host: smtpHost, port: parseInt(import.meta.env.SMTP_PORT ?? '587'), secure: import.meta.env.SMTP_SECURE === 'true', auth: { user: smtpUser, pass: smtpPass } });
  const from = { name: import.meta.env.SMTP_FROM_NAME ?? 'The Volleyball Uniforms', address: import.meta.env.SMTP_FROM_EMAIL ?? smtpUser };

  const ref = orderRef();
  const address = [v.address1, v.address2, [v.city, v.region, v.postal].filter(Boolean).join(', '), country.name].filter(Boolean).join('\n');
  const payLine = 'PayPal invoice: send it after the customer approves the design mockup';
  const itemText = lines.map((l) => `- ${l.name}: ${l.qty} x ${money(l.price)} per ${l.unit} = ${money(l.total)}`).join('\n');
  const td = 'style="padding:6px 12px;border-bottom:1px solid #e3e5e8"';
  const itemHtml = `<table style="font-family:sans-serif;border-collapse:collapse">${lines.map((l) => `<tr><td ${td}><a href="${l.url}">${esc(l.name)}</a></td><td ${td}>${l.qty} x ${money(l.price)}</td><td ${td} align="right">${money(l.total)}</td></tr>`).join('')}<tr><td ${td}>Shipping</td><td ${td}></td><td ${td} align="right">Free</td></tr><tr><th align="left" ${td}>Total</th><td ${td}></td><th ${td} align="right">${money(total)}</th></tr></table>`;
  const office = [`PAYMENT: ${payLine}`, spamLine, `Order ${ref}`, '', itemText, `Total: ${money(total)} (free shipping)`, '', `Name: ${v.name}`, `Email: ${v.email}`, `Phone: ${v.phone}`, v.company ? `Team: ${v.company}` : '', '', 'Ship to:', address, '', v.notes ? `Notes: ${v.notes}` : '', 'Site: thevolleyballuniforms.com'].filter((x) => x !== '').join('\n');

  try {
    await mailer.sendMail({
      from, to: smtpTo, replyTo: { name: oneLine(v.name), address: oneLine(v.email) },
      subject: `${spam.length ? '[Possible spam] ' : ''}New order ${ref}: ${money(total)}, PayPal invoice | thevolleyballuniforms.com`,
      text: office,
      html: `<p style="font-family:sans-serif;font-size:16px;background:#fff4cc;padding:10px 12px"><b>PAYMENT:</b> ${esc(payLine)}</p>${spamLine ? `<p style="font-family:sans-serif;background:#fde3d8;padding:8px 12px">${esc(spamLine)}</p>` : ''}<h2 style="font-family:sans-serif">Order ${ref}</h2>${itemHtml}<p style="font-family:sans-serif">${esc(v.name)}<br>${esc(v.email)}<br>${esc(v.phone)}${v.company ? `<br>${esc(v.company)}` : ''}</p><p style="font-family:sans-serif"><b>Ship to</b><br>${esc(address).replace(/\n/g, '<br>')}</p>${v.notes ? `<p style="font-family:sans-serif"><b>Notes</b><br>${esc(v.notes).replace(/\n/g, '<br>')}</p>` : ''}`,
      attachments,
    });
  } catch (err) {
    console.error('order send failed', err instanceof Error ? err.message : err, ref);
    return json(502, { ok: false, error: 'We could not send your order' });
  }

  const steps = ['Our designers prepare your free mockup and email it to you.', 'You approve the design or ask for changes. Nothing is made before you approve.', 'We email a PayPal invoice. Production starts when it is paid: 10–14 business days, or 5–7 with rush.', `Your uniforms ship free to ${country.name} by tracked courier.`];
  try {
    await mailer.sendMail({
      from, to: { name: oneLine(v.name), address: oneLine(v.email) }, replyTo: 'Info@thevolleyballuniforms.com',
      subject: `Your order ${ref} with The Volleyball Uniforms`,
      text: [`Hi ${v.name},`, '', `Thank you for your order ${ref}.`, '', itemText, 'Shipping: free', `Total: ${money(total)}`, 'Payment: PayPal invoice after you approve your design', '', 'What happens next:', ...steps.map((s, i) => `${i + 1}. ${s}`), '', `Ship to:\n${address}`, '', 'Questions? Call +1 213-449-3746 or reply to this email.', 'The Volleyball Uniforms'].join('\n'),
      html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.5"><p>Hi ${esc(v.name)},</p><p>Thank you for your order <b>${ref}</b>.</p>${itemHtml}<p><b>Payment:</b> PayPal invoice after you approve your design</p><p><b>What happens next</b></p><ol>${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol><p><b>Ship to</b><br>${esc(address).replace(/\n/g, '<br>')}</p><p>Questions? Call +1 213-449-3746 or reply to this email.</p><p>The Volleyball Uniforms</p></div>`,
    });
  } catch (err) {
    console.error('order buyer copy failed', err instanceof Error ? err.message : err, ref);
  }
  return json(200, { ok: true, ref, total, payment: 'paypal' });
};
