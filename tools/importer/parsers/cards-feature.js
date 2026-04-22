/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature
 * Base block: cards
 * Source: https://www.cbsa-asfc.gc.ca/menu-eng.html
 * Generated: 2026-04-22
 *
 * Handles three source HTML patterns:
 *   1. News items (div.col-md-6): <a> wrapping <img> + <p> title, sibling <p> description
 *   2. Leadership cards (section.col-md-4): <h3> role + <a> wrapping <figure>, sibling <p> description
 *   3. Feature promotional (div.col-lg-4): <a> wrapping <figure> + <p> description (all inside link)
 *
 * Target: Cards block with 2 columns per row — [image | title + description + link]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract common elements
  const img = element.querySelector('img');
  const link = element.querySelector('a');
  const figcaption = element.querySelector('figcaption');
  const figure = element.querySelector('figure');

  // Build the image cell
  const imageCell = [];
  if (img) {
    const imgClone = img.cloneNode(true);
    imageCell.push(imgClone);
  }

  // Build the text cell — logic varies by pattern
  const textCell = [];

  // Detect which pattern we are dealing with
  const isLeadership = !!element.querySelector(':scope > h3');
  const hasFigure = !!figure;
  const hasDirectDescP = !!element.querySelector(':scope > p');

  if (isLeadership) {
    // Pattern 2: Leadership cards (section.col-md-4)
    // Structure: <h3>Role</h3> <a><figure><img><figcaption>Name</figcaption></figure></a> <p>Full title</p>
    const roleHeading = element.querySelector(':scope > h3');
    const name = figcaption ? figcaption.textContent.trim() : '';
    const descP = element.querySelector(':scope > p');

    if (roleHeading) {
      const heading = document.createElement('strong');
      heading.textContent = roleHeading.textContent.trim();
      textCell.push(heading);
    }
    if (name) {
      const nameP = document.createElement('p');
      nameP.textContent = name;
      textCell.push(nameP);
    }
    if (descP) {
      const desc = document.createElement('p');
      desc.textContent = descP.textContent.trim();
      textCell.push(desc);
    }
    if (link && link.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = link.href;
      ctaLink.textContent = name || link.textContent.trim();
      textCell.push(ctaLink);
    }
  } else if (hasFigure && !hasDirectDescP) {
    // Pattern 3: Feature promotional (div.col-lg-4)
    // Structure: <a><figure><img><figcaption>Title</figcaption></figure><p>Description</p></a>
    const title = figcaption ? figcaption.textContent.trim() : '';
    // Description is a <p> inside the <a> but outside the <figure>
    const descP = link ? link.querySelector(':scope > p') : null;

    if (title) {
      const heading = document.createElement('strong');
      heading.textContent = title;
      textCell.push(heading);
    }
    if (descP) {
      const desc = document.createElement('p');
      desc.textContent = descP.textContent.trim();
      textCell.push(desc);
    }
    if (link && link.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = link.href;
      ctaLink.textContent = title || link.textContent.trim();
      textCell.push(ctaLink);
    }
  } else {
    // Pattern 1: News items (div.col-md-6)
    // Structure: <a><img><p>Title</p></a> <p>Description</p>
    const titleP = link ? link.querySelector('p') : null;
    const title = titleP ? titleP.textContent.trim() : '';
    const descP = element.querySelector(':scope > p');

    if (title) {
      const heading = document.createElement('strong');
      heading.textContent = title;
      textCell.push(heading);
    }
    if (descP) {
      const desc = document.createElement('p');
      desc.textContent = descP.textContent.trim();
      textCell.push(desc);
    }
    if (link && link.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = link.href;
      ctaLink.textContent = title || link.textContent.trim();
      textCell.push(ctaLink);
    }
  }

  // Only add row if we have meaningful content
  if (imageCell.length > 0 || textCell.length > 0) {
    cells.push([imageCell.length > 0 ? imageCell : '', textCell.length > 0 ? textCell : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
