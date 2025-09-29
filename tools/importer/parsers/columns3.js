/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  const getImmediateDivs = (el) => Array.from(el.querySelectorAll(':scope > div'));

  // Find the main columns block (usually the first child of columns-wrapper)
  let columnsBlock = element;
  // Defensive: if this is a wrapper, descend one level
  if (element.classList.contains('columns-wrapper')) {
    const firstDiv = element.querySelector(':scope > div');
    if (firstDiv && firstDiv.classList.contains('columns')) {
      columnsBlock = firstDiv;
    }
  }

  // Get the rows (each direct child div of columns block)
  const rows = getImmediateDivs(columnsBlock);

  // Prepare header row
  const headerRow = ['Columns (columns3)'];

  // Prepare content rows
  const contentRows = [];

  // Defensive: Only proceed if there are at least two rows
  if (rows.length >= 2) {
    // First visual row: 2 columns (left: text, right: image)
    const firstRowDivs = getImmediateDivs(rows[0]);
    // left column: text content (could be a div with p, ul, button)
    const leftCol = firstRowDivs[0];
    // right column: image (div with picture)
    const rightCol = firstRowDivs[1];
    // Defensive: check existence
    const firstRowCells = [];
    if (leftCol) firstRowCells.push(leftCol);
    else firstRowCells.push('');
    if (rightCol) firstRowCells.push(rightCol);
    else firstRowCells.push('');
    contentRows.push(firstRowCells);

    // Second visual row: 2 columns (left: image, right: text/button)
    const secondRowDivs = getImmediateDivs(rows[1]);
    // left column: image (div with picture)
    const leftCol2 = secondRowDivs[0];
    // right column: text/button (div with p, button)
    const rightCol2 = secondRowDivs[1];
    const secondRowCells = [];
    if (leftCol2) secondRowCells.push(leftCol2);
    else secondRowCells.push('');
    if (rightCol2) secondRowCells.push(rightCol2);
    else secondRowCells.push('');
    contentRows.push(secondRowCells);
  }

  // Build the table
  const tableCells = [headerRow, ...contentRows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
