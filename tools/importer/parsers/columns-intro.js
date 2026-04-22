/* global WebImporter */

/**
 * Parser for columns-intro block.
 * Converts the intro row (text left | social media links right) into a Columns block.
 * Source: div.row.mrgn-tp-lg containing col-sm-8 (text) and col-sm-4 (social links)
 */
export default function columnsIntroParser(element, { document }) {
  // Column 1: intro paragraph (col-sm-8)
  const textCol = element.querySelector('.col-sm-8');
  // Column 2: social media section (col-sm-4)
  const socialCol = element.querySelector('.col-sm-4');

  if (!textCol || !socialCol) return;

  // Build column 1 content
  const col1 = document.createElement('div');
  const introP = textCol.querySelector('p');
  if (introP) {
    col1.appendChild(introP.cloneNode(true));
  }

  // Build column 2 content
  const col2 = document.createElement('div');
  const followSection = socialCol.querySelector('section.gc-followus');
  if (followSection) {
    const heading = followSection.querySelector('h2');
    if (heading) {
      col2.appendChild(heading.cloneNode(true));
    }
    const linkList = followSection.querySelector('ul');
    if (linkList) {
      // Convert social links from icon-only to text links
      const ul = document.createElement('ul');
      linkList.querySelectorAll('li > a').forEach((a) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.href;
        // Get link text from the wb-inv span or class name
        const label = a.querySelector('.wb-inv');
        link.textContent = label ? label.textContent.trim() : a.className.split(' ')[0];
        li.appendChild(link);
        ul.appendChild(li);
      });
      col2.appendChild(ul);
    }
  }

  // Build block table
  const cells = [
    ['Columns Intro'],
    [col1, col2],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
