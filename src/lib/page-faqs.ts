import data from '../data/page-faqs.json';

/**
 * Extra FAQs keyed by route so every indexable page carries at least ten.
 * FAQSection appends them to the list it renders (and to its FAQPage node);
 * pages without a FAQ block render FAQSection with an empty list.
 */
type Item = { question: string; answer: string };
type Entry = { h2: string; faqs: { q: string; a: string }[] };
const DATA = data as Record<string, Entry>;
const norm = (p: string) => (p.endsWith('/') ? p : p + '/');

export const extraFaqs = (path: string): Item[] =>
  (DATA[norm(path)]?.faqs ?? []).map((f) => ({ question: f.q, answer: f.a }));

export function withExtras(path: string, faqs: Item[]): Item[] {
  const seen = new Set(faqs.map((f) => f.question.trim().toLowerCase()));
  return [...faqs, ...extraFaqs(path).filter((f) => !seen.has(f.question.trim().toLowerCase()))];
}

export const extraHeading = (path: string) => DATA[norm(path)]?.h2 ?? 'Frequently Asked Questions';
export const plainText = (html: string) => html.replace(/<[^>]+>/g, '');
