/* global WebImporter */
export default function parse(element, { document }) {
  // Traverse to the main content container
  let contentDiv = element;
  while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }

  // Find the image (picture or img)
  let imageEl = null;
  const picture = contentDiv.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = contentDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // Gather all heading and paragraph elements (excluding the image)
  const textEls = [];
  Array.from(contentDiv.children).forEach((child) => {
    if (child.querySelector && child.querySelector('picture')) return;
    if (
      ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'].includes(child.tagName) &&
      child.textContent.trim()
    ) {
      textEls.push(child);
    }
  });

  // Build table rows: header, image row, content row (even if empty)
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Per spec: always 3 rows (header, image, content), so add an empty content row if needed
  const contentRow = [textEls.length ? textEls : ''];
  // Add a third row (empty) if there is only image and no text
  const cells = [headerRow, imageRow, contentRow];
  // If there is no text and no image, still ensure 3 rows

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
