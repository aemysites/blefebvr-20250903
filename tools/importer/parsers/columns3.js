/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Find all immediate child rows of the columns block
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (rows.length === 0) return;

  // Block header row as required
  const headerRow = ['Columns (columns3)'];
  const tableRows = [];

  rows.forEach((row) => {
    // Each row contains two columns
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    if (cols.length === 0) return;
    const cells = cols.map((col) => {
      // If column is just an image wrapper, use the image/picture directly
      const imgCol = col.querySelector(':scope > .columns-img-col');
      if (imgCol && col.children.length === 1) {
        return imgCol;
      }
      // Otherwise, return the column itself (preserves all text, lists, buttons)
      return col;
    });
    tableRows.push(cells);
  });

  // Create the table with block header and rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...tableRows
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
