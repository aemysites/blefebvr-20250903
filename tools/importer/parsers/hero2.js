/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest content container
  let mainDiv = element;
  while (mainDiv && mainDiv.querySelector(':scope > div')) {
    mainDiv = mainDiv.querySelector(':scope > div');
  }
  if (!mainDiv) return;

  // Find the <picture> element for the background image
  const picture = mainDiv.querySelector('picture');

  // Collect all content elements except the <p> containing <picture>
  // All content (title, subheading, CTA) must be in a single cell (array of elements)
  const contentElements = [];
  mainDiv.childNodes.forEach((node) => {
    if (node.nodeType === 1) { // ELEMENT_NODE
      // Skip <p> that contains <picture>
      if (node.tagName === 'P' && node.querySelector('picture')) return;
      // Include all non-empty elements
      if (node.textContent && node.textContent.trim() !== '') {
        contentElements.push(node.cloneNode(true));
      }
    }
  });

  // Fallback: If no content elements found, try to get all text nodes
  if (contentElements.length === 0) {
    Array.from(mainDiv.childNodes).forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim() !== '') { // TEXT_NODE
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        contentElements.push(p);
      }
    });
  }

  const headerRow = ['Hero (hero2)'];
  const imageRow = [picture ? picture : ''];
  // The content row must always be a single cell containing all content elements (even if only one)
  const contentRow = [contentElements.length ? contentElements : ''];

  // Always produce 3 rows: header, image, content (even if some are empty)
  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
