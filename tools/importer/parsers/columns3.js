/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Columns (columns3)'];

  // Find the main .columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all direct children divs (each represents a row in the columns block)
  const rows = Array.from(columnsBlock.children);
  if (rows.length < 2) return;

  // First row: left (text+ul+button), right (image)
  const firstRowCells = [rows[0], rows[1]];
  // Second row: left (image), right (text+button)
  const secondRowCells = [rows[2], rows[3]];

  // Defensive: ensure both cells exist for each row
  if (!firstRowCells[0] || !firstRowCells[1] || !secondRowCells[0] || !secondRowCells[1]) return;

  // Build table rows
  const tableRows = [headerRow, firstRowCells, secondRowCells];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
