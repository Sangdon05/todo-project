export function htmlToElement(html) {
  const doc = Document.parseHTMLUnsafe(html.trim());
  return doc.body.firstChild;
};
