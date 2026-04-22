/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-links
 * Base block: columns
 * Source: https://www.cbsa-asfc.gc.ca/menu-eng.html
 * Generated: 2026-04-22
 *
 * Handles two contexts on the source page:
 * 1. "What we are doing" section: 3 columns (col-md-4) each with h3 heading + link list + optional "view all" link
 * 2. "Corporate Information" section: 2 columns (col-md-6) each with link list only (no headings)
 *
 * Source structure: div.row.wb-eqht > div.col-md-N > section.lnkbx
 * Each section.lnkbx contains:
 *   - Optional h3.h5 or h2 heading
 *   - ul.lst-spcd with li > a links
 *   - Optional div.clearfix with a "view all" strong > a link
 *
 * The parser receives individual section.lnkbx elements. It navigates to the
 * parent .row container, collects all sibling .lnkbx sections, and builds one
 * Columns block with each .lnkbx as a column cell in a single row.
 * The first matched element is replaced with the block; subsequent siblings
 * for the same row are detected via a marker attribute and removed.
 */
export default function parse(element, { document }) {
  // Navigate from section.lnkbx up to the parent row container.
  // Structure: div.row.wb-eqht > div.col-md-N > section.lnkbx
  const colWrapper = element.closest('[class*="col-md-"]');
  const rowContainer = colWrapper ? colWrapper.closest('.row') : null;

  // Check if this row was already processed by a prior sibling call.
  // Uses a marker attribute on the row container for deduplication.
  if (rowContainer && rowContainer.getAttribute('data-columns-links-done')) {
    element.remove();
    return;
  }

  // Mark the row as processed
  if (rowContainer) {
    rowContainer.setAttribute('data-columns-links-done', 'true');
  }

  // Collect all section.lnkbx elements within the row container
  const lnkbxSections = rowContainer
    ? Array.from(rowContainer.querySelectorAll('section.lnkbx'))
    : [element];

  // Extract content from each section.lnkbx using cloneNode for stable references
  const columnCells = lnkbxSections.map((section) => {
    const cellContent = [];

    // Extract heading if present (h3.h5 in "What we are doing", h2 in sidebar contexts)
    const heading = section.querySelector(':scope > h3, :scope > h5, :scope > h2');
    if (heading) {
      cellContent.push(heading.cloneNode(true));
    }

    // Extract the link list
    const list = section.querySelector(':scope > ul');
    if (list) {
      cellContent.push(list.cloneNode(true));
    }

    // Extract optional "view all" link from div.clearfix > p > strong > a
    const clearfix = section.querySelector(':scope > div.clearfix');
    if (clearfix) {
      const viewAllLink = clearfix.querySelector('a');
      if (viewAllLink && viewAllLink.textContent.trim()) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.appendChild(viewAllLink.cloneNode(true));
        p.appendChild(strong);
        cellContent.push(p);
      }
    }

    return cellContent;
  });

  // Build cells array: single row with N columns (one per lnkbx section)
  const cells = [columnCells];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-links',
    cells,
  });

  element.replaceWith(block);
}
