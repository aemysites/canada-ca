/* global WebImporter */

/**
 * Parser for columns-news block.
 * Converts the Latest news section into a 3-column Columns block:
 *   Col 1: First news item (image + title + description)
 *   Col 2: Second news item (image + title + description)
 *   Col 3: News feed list + "All news" link
 * Source: div.gc-nws containing col-md-8 (two news cards) and col-md-4 (feed)
 */
export default function columnsNewsParser(element, { document }) {
  // The two news items are in .col-md-8 > .row > .col-md-6
  const newsItems = element.querySelectorAll('.col-md-8 > .row > .col-md-6');
  // The feed column is .wb-feeds or .col-md-4 (the feed sidebar)
  const feedCol = element.querySelector('.col-md-4.wb-feeds') || element.querySelector(':scope > .col-md-4');

  if (newsItems.length < 2) return;

  // Build news columns
  const columns = [];

  newsItems.forEach((item) => {
    const col = document.createElement('div');

    // Get the image
    const img = item.querySelector('img');
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.src;
      pic.alt = img.alt || '';
      col.appendChild(pic);
    }

    // Get the linked title
    const link = item.querySelector('a');
    if (link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      // Title is in a <p> inside the <a>
      const titleP = link.querySelector('p');
      a.textContent = titleP ? titleP.textContent.trim() : link.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(a);
      p.appendChild(strong);
      col.appendChild(p);
    }

    // Get the description paragraph (sibling <p> outside the <a>)
    const desc = item.querySelector(':scope > p');
    if (desc) {
      col.appendChild(desc.cloneNode(true));
    }

    columns.push(col);
  });

  // Build feed column (col 3)
  const col3 = document.createElement('div');
  if (feedCol) {
    const feedList = feedCol.querySelector('ul');
    if (feedList) {
      const ul = document.createElement('ul');
      feedList.querySelectorAll('li').forEach((li) => {
        const newLi = document.createElement('li');
        const a = li.querySelector('a');
        if (a) {
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = a.textContent.trim();
          newLi.appendChild(link);
        }
        ul.appendChild(newLi);
      });
      col3.appendChild(ul);
    }

    // "All news" link
    const allNewsLink = feedCol.querySelector('p > strong > a');
    if (allNewsLink) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = allNewsLink.href;
      a.textContent = allNewsLink.textContent.trim();
      strong.appendChild(a);
      p.appendChild(strong);
      col3.appendChild(p);
    }
  }

  columns.push(col3);

  // Build block table
  const cells = [
    ['Columns News'],
    columns,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
