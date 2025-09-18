/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct cards block
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards.block');
  }
  if (!cardsBlock) return;

  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children);

  // Header row per spec
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cards.forEach((li) => {
    // Image cell: reference the <picture> element directly
    const imgDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) imageCell = picture;
      else {
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: preserve all text content, semantic structure
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use all children (usually <p>), preserve <strong> for heading
      const fragments = [];
      Array.from(bodyDiv.children).forEach((child) => {
        // Clone to preserve formatting (e.g., <strong>)
        fragments.push(child.cloneNode(true));
      });
      // If only one child, use it directly; else, wrap in a <div>
      if (fragments.length === 1) {
        textCell = fragments[0];
      } else if (fragments.length > 1) {
        const wrapper = document.createElement('div');
        fragments.forEach(f => wrapper.appendChild(f));
        textCell = wrapper;
      }
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
