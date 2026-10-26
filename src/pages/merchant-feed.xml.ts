// Google Merchant feed from the same catalogue as the pages (src/data/products.ts):
// one item per product at its per-item price, free shipping to every SHIP_COUNTRIES entry.
import { products, offerPrice, SHIP_COUNTRIES } from '../data/products';

const SITE = 'https://thevolleyballuniforms.com';
const x = (s: unknown) => String(s ?? '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

export function GET() {
  const items = products.map((p) => `  <item>
    <g:id>TVU-${x(p.slug)}</g:id>
    <title>${x(p.name)}</title>
    <description>${x(`${p.shortDescription} Custom made for your team with names, numbers and logos, after you approve a free design mockup. Priced per ${p.priceUnit}.`)}</description>
    <link>${SITE}/${x(p.slug)}/</link>
    <g:image_link>${x(SITE + p.images[0])}</g:image_link>${p.images.slice(1, 6).map((i) => `\n    <g:additional_image_link>${x(SITE + i)}</g:additional_image_link>`).join('')}
    <g:availability>in_stock</g:availability>
    <g:condition>new</g:condition>
    <g:price>${offerPrice(p)} USD</g:price>
    <g:brand>The Volleyball Uniforms</g:brand>
    <g:identifier_exists>no</g:identifier_exists>
    <g:google_product_category>1604</g:google_product_category>
    <g:product_type>${x(p.category.replace(/-/g, ' '))}</g:product_type>
${SHIP_COUNTRIES.map((c) => `    <g:shipping><g:country>${c.code}</g:country><g:service>Free shipping</g:service><g:price>0.00 USD</g:price><g:min_transit_time>${c.transit[0]}</g:min_transit_time><g:max_transit_time>${c.transit[1]}</g:max_transit_time></g:shipping>`).join('\n')}
    <g:min_handling_time>10</g:min_handling_time>
    <g:max_handling_time>14</g:max_handling_time>
  </item>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>The Volleyball Uniforms</title>
  <link>${SITE}/</link>
  <description>Custom volleyball jerseys and uniforms.</description>
${items}
</channel>
</rss>
`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
