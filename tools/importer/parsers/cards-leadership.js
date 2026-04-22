/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-leadership block.
 * Converts the leadership section (Minister, Secretary of State, Management)
 * into a single Cards block with 3 rows (one per person).
 *
 * Source: section.gc-crprt containing .wb-eqht > section.col-md-4 items
 * Each item has: h3 (role), a > figure > img + figcaption (linked photo + name), p (title)
 *
 * Target: Cards block with 2 columns per row: [image | role heading + name + title + link]
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.wb-eqht > section.col-md-4');
  if (items.length === 0) return;

  const cells = [];

  items.forEach((item) => {
    const imgCell = document.createElement('div');
    const textCell = document.createElement('div');

    // Image
    const img = item.querySelector('img');
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.src;
      pic.alt = img.alt || '';
      imgCell.appendChild(pic);
    }

    // Role heading (h3)
    const role = item.querySelector('h3');
    if (role) {
      const p = document.createElement('p');
      p.textContent = role.textContent.trim();
      const strong = document.createElement('strong');
      strong.textContent = p.textContent;
      p.textContent = '';
      p.appendChild(strong);
      textCell.appendChild(p);
    }

    // Name from figcaption
    const caption = item.querySelector('figcaption');
    if (caption) {
      const p = document.createElement('p');
      p.textContent = caption.textContent.trim();
      textCell.appendChild(p);
    }

    // Title from <p> after the <a>
    const titleP = item.querySelector(':scope > p');
    if (titleP) {
      const p = document.createElement('p');
      p.textContent = titleP.textContent.trim();
      textCell.appendChild(p);
    }

    // Link
    const link = item.querySelector('a');
    if (link && caption) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = caption.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(
    [['Cards Leadership'], ...cells],
    document,
  );
  element.replaceWith(block);
}
