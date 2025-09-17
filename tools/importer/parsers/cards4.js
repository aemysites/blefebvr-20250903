/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Prepare the table header
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Get all <li> (cards)
  const cards = ul.querySelectorAll(':scope > li');
  cards.forEach((li) => {
    // Defensive: find image container and body container
    const imgDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // Defensive: skip if missing either
    if (!imgDiv || !bodyDiv) return;

    // The image cell: use the .cards-card-image div directly (contains <picture>)
    // The text cell: use the .cards-card-body div directly (contains <p><strong>...</strong></p> and <p>description</p>)
    rows.push([imgDiv, bodyDiv]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
