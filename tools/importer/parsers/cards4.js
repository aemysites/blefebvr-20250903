/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cards block inside the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  const cards = Array.from(ul.children); // li elements

  // Header row as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cards.forEach((li) => {
    // Find image (first cell)
    const imageDiv = li.querySelector('.cards-card-image');
    let imageEl = null;
    if (imageDiv) {
      // Use the <picture> element if present, otherwise <img>
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Find text content (second cell)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textContent = null;
    if (bodyDiv) {
      // Use the entire bodyDiv for resilience
      textContent = bodyDiv;
    }

    // Only add row if both image and text are present
    if (imageEl && textContent) {
      rows.push([imageEl, textContent]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
