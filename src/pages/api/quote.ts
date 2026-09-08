export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const name     = (data.get('name')     as string | null)?.trim() ?? '';
    const email    = (data.get('email')    as string | null)?.trim() ?? '';
    const phone    = (data.get('phone')    as string | null)?.trim() ?? '';
    const team     = (data.get('team')     as string | null)?.trim() ?? '';
    const product  = (data.get('product')  as string | null)?.trim() ?? '';
    const quantity = (data.get('quantity') as string | null)?.trim() ?? '';
    const deadline = (data.get('deadline') as string | null)?.trim() ?? '';
    const message  = (data.get('message')  as string | null)?.trim() ?? '';
    const artwork  = data.get('artwork');

    if (!name || !email || !team) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name, email, and team are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const smtpHost = import.meta.env.SMTP_HOST;
    const smtpUser = import.meta.env.SMTP_USER;
    const smtpPass = import.meta.env.SMTP_PASS;
    const smtpTo   = import.meta.env.SMTP_TO   ?? smtpUser;
    const fromName = import.meta.env.SMTP_FROM_NAME ?? 'The Volleyball Uniforms';
    const fromMail = import.meta.env.SMTP_FROM_EMAIL ?? smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('SMTP environment variables are not configured.');
      return new Response(
        JSON.stringify({ success: false, error: 'Mail server is not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(import.meta.env.SMTP_PORT ?? '587'),
      secure: import.meta.env.SMTP_SECURE === 'true',
      auth: { user: smtpUser, pass: smtpPass },
    });

    const row = (label: string, value: string) =>
      value
        ? `<tr>
            <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;background:#f9fafb;border-bottom:1px solid #e5e7eb;width:160px;vertical-align:top">${label}</td>
            <td style="padding:10px 16px;font-size:15px;color:#111827;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${value}</td>
           </tr>`
        : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr>
          <td style="background:#0f1340;padding:28px 32px">
            <p style="margin:0;font-size:13px;font-weight:700;color:#fbbf24;text-transform:uppercase;letter-spacing:0.05em">New Quote Request</p>
            <h1 style="margin:6px 0 0;font-size:22px;color:#ffffff">The Volleyball Uniforms</h1>
          </td>
        </tr>
        <!-- Fields -->
        <tr><td style="padding:8px 0">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row('Full Name',   name)}
            ${row('Email',       `<a href="mailto:${email}" style="color:#2563eb">${email}</a>`)}
            ${row('Phone',       phone)}
            ${row('Team / Org',  team)}
            ${row('Product',     product)}
            ${row('Quantity',    quantity)}
            ${row('Needed By',   deadline)}
            ${row('Details',     message)}
            ${row('Artwork',     artwork instanceof File && artwork.size ? `${artwork.name} (attached)` : '')}
          </table>
        </td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb">
            <p style="margin:0;font-size:12px;color:#6b7280">
              Submitted via <strong>thevolleyballuniforms.com</strong>.
              Reply directly to this email to respond to ${name}.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Where this enquiry came from, written by the SITE.
    //
    // The ZeeOps Gmail intake files a lead either by a label somebody put on
    // the thread or by finding one of our own domains in the mail. This mail
    // named neither, so the label was the only thing holding it up — and an
    // enquiry with the same gap sat unfiled for four hours on 8 Sep 2026 and
    // had to be entered by hand. "Page URL:" is the exact marker it matches.
    //
    // Read from the Referer the browser sends with this POST, never from the
    // form body, so a cached copy of an older script cannot leave it out. It
    // goes in a PLAIN-TEXT part as well: the intake reads the plain body, and
    // relying on Gmail to render one out of the HTML is a dependency worth not
    // having.
    const SITE = 'https://thevolleyballuniforms.com';
    const referer = request.headers.get('referer') ?? '';
    const pageUrl = referer.startsWith(SITE) ? referer : `${SITE}/`;
    const source = `--- where this came from ---\nPage URL: ${pageUrl}`;
    const htmlWithSource = html.replace(
      '</body>',
      `<p style="margin:16px 0 0;font-size:12px;color:#94a3b8">Page URL: <a href="${pageUrl}" style="color:#94a3b8">${pageUrl}</a></p></body>`,
    );

    await transporter.sendMail({
      from:    `"${fromName}" <${fromMail}>`,
      to:      smtpTo,
      replyTo: email,
      subject: `New Quote Request — ${team}${product ? ` | ${product}` : ''}`,
      text: [
        `Name: ${name}`, `Email: ${email}`, team && `Team: ${team}`,
        product && `Product: ${product}`, '', source,
      ].filter(Boolean).join('\n'),
      html: htmlWithSource,
      attachments:
        artwork instanceof File && artwork.size
          ? [{ filename: artwork.name, content: Buffer.from(await artwork.arrayBuffer()) }]
          : undefined,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Quote form error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message ?? 'Failed to send. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
