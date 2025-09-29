/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero.block
  const heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) return;

  // Find the innermost div containing the actual content
  let contentDiv = heroBlock;
  while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }

  // Extract the background image (picture)
  let imageEl = '';
  const firstPicP = contentDiv.querySelector('p picture');
  if (firstPicP) {
    imageEl = firstPicP.closest('p'); // include the <p> for context
  }

  // Extract all text content (h1, h2, h3, ... and p) in DOM order, skipping the image <p>
  const textContent = [];
  Array.from(contentDiv.children).forEach(child => {
    if (imageEl && child === imageEl) return; // skip the image row
    if (/^H[1-6]$/.test(child.tagName) || (child.tagName === 'P' && child.textContent.trim())) {
      textContent.push(child);
    }
  });

  // Always ensure the table has 3 rows (header, image, text), even if some are empty
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textContent.length ? textContent : ''];

  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
