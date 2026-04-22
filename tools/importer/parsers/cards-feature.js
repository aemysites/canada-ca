/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature block.
 * Targets the parent section.gc-prtts and collects all feature cards into one block.
 *
 * Source: section.gc-prtts > div.row > div.col-lg-4
 * Each item: <a><figure><img><figcaption>Title</figcaption></figure><p>Description</p></a>
 *
 * Target: Single Cards block with 2 columns per row — [image | title + description + link]
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.row > div.col-lg-4, .row > div.col-md-6');
  if (items.length === 0) return;

  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a');
    const img = item.querySelector('img');
    const figcaption = item.querySelector('figcaption');
    const descP = link ? link.querySelector(':scope > p') : null;

    const imageCell = document.createElement('div');
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.src;
      pic.alt = img.alt || '';
      imageCell.appendChild(pic);
    }

    const textCell = document.createElement('div');
    const title = figcaption ? figcaption.textContent.trim() : '';

    if (title) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title;
      p.appendChild(strong);
      textCell.appendChild(p);
    }

    if (descP) {
      const p = document.createElement('p');
      p.textContent = descP.textContent.trim();
      textCell.appendChild(p);
    }

    if (link && link.href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = title || link.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(
    [['Cards Feature'], ...cells],
    document,
  );
  element.replaceWith(block);
}
