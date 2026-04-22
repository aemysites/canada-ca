/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-service block.
 * Produces TWO columns-service blocks from the parent row:
 *
 * Block 1 (Travel + Most Requested):
 *   Col 1: "Travel" heading + first 2 doormat items
 *   Col 2: Remaining 2 doormat items
 *   Col 3: "Most requested" heading + link list
 *
 * Block 2 (Trade + Contact Us):
 *   Col 1: "Trade" heading + first 3 doormat items
 *   Col 2: Remaining 2 doormat items
 *   Col 3: "Contact us" heading + link
 *
 * Block 3 (Protecting the Canadian border):
 *   Col 1: "Protecting" heading + first 2 doormat items
 *   Col 2: Remaining 2 doormat items
 *   Col 3: (empty)
 */
export default function parse(element, { document }) {
  const leftSection = element.querySelector('section.col-md-8.pull-left');
  const mostRequestedCol = element.querySelector('.col-md-4.pull-right');

  if (!leftSection || !mostRequestedCol) return;

  // Helper: build doormat content div
  function buildDoormat(doormat) {
    const div = document.createElement('div');
    const heading = doormat.querySelector('h3, h2, h4');
    if (heading) div.appendChild(heading.cloneNode(true));
    const desc = doormat.querySelector('p');
    if (desc) div.appendChild(desc.cloneNode(true));
    return div;
  }

  // Helper: split doormats into 2 columns at a given index
  function splitDoormats(doormats, splitAt) {
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    doormats.forEach((d, i) => {
      (i < splitAt ? col1 : col2).appendChild(buildDoormat(d));
    });
    return [col1, col2];
  }

  // --- BLOCK 1: Travel + Most Requested ---
  const travelHeading = leftSection.querySelector(':scope > h2');
  const travelGrid = leftSection.querySelector(':scope > div.wb-eqht');
  const travelDoormats = travelGrid ? travelGrid.querySelectorAll('.gc-drmt') : [];

  const [travelCol1, travelCol2] = splitDoormats(travelDoormats, 2);
  if (travelHeading) {
    travelCol1.insertBefore(travelHeading.cloneNode(true), travelCol1.firstChild);
  }

  // Most Requested sidebar (col 3)
  const mrCol = document.createElement('div');
  const lnkbx = mostRequestedCol.querySelector('section.lnkbx');
  if (lnkbx) {
    const h = lnkbx.querySelector('h2');
    if (h) mrCol.appendChild(h.cloneNode(true));
    const ul = lnkbx.querySelector('ul');
    if (ul) mrCol.appendChild(ul.cloneNode(true));
  }

  const block1 = WebImporter.DOMUtils.createTable(
    [['Columns Service'], [travelCol1, travelCol2, mrCol]],
    document,
  );

  // --- Identify Trade and Protecting sections ---
  const childSections = leftSection.querySelectorAll(':scope > section');
  let tradeSection = null;
  let protectingSection = null;
  childSections.forEach((s) => {
    const h = s.querySelector('h2');
    if (!h) return;
    const text = h.textContent.trim().toLowerCase();
    if (text.includes('trade')) tradeSection = s;
    else if (text.includes('protecting')) protectingSection = s;
  });

  // --- Find Contact Us ---
  let contactLnkbx = null;
  element.querySelectorAll('.col-md-4 section.lnkbx').forEach((s) => {
    const h = s.querySelector('h2');
    if (h && h.textContent.trim().toLowerCase().includes('contact')) {
      contactLnkbx = s;
    }
  });

  // --- BLOCK 2: Trade + Contact Us ---
  let block2 = null;
  if (tradeSection) {
    const tradeHeading = tradeSection.querySelector('h2');
    const tradeDoormats = tradeSection.querySelectorAll('.gc-drmt');

    const [tradeCol1, tradeCol2] = splitDoormats(tradeDoormats, 3);
    if (tradeHeading) {
      tradeCol1.insertBefore(tradeHeading.cloneNode(true), tradeCol1.firstChild);
    }

    // Contact Us sidebar (col 3)
    const cuCol = document.createElement('div');
    if (contactLnkbx) {
      const ch = contactLnkbx.querySelector('h2');
      if (ch) cuCol.appendChild(ch.cloneNode(true));
      const cp = contactLnkbx.querySelector('p');
      if (cp) cuCol.appendChild(cp.cloneNode(true));
    }

    block2 = WebImporter.DOMUtils.createTable(
      [['Columns Service'], [tradeCol1, tradeCol2, cuCol]],
      document,
    );
  }

  // --- BLOCK 3: Protecting the Canadian border (empty col 3) ---
  let block3 = null;
  if (protectingSection) {
    const protHeading = protectingSection.querySelector('h2');
    const protDoormats = protectingSection.querySelectorAll('.gc-drmt');

    const [protCol1, protCol2] = splitDoormats(protDoormats, 2);
    if (protHeading) {
      protCol1.insertBefore(protHeading.cloneNode(true), protCol1.firstChild);
    }

    // Empty col 3 to keep consistent 3-column grid
    const emptyCol = document.createElement('div');

    block3 = WebImporter.DOMUtils.createTable(
      [['Columns Service'], [protCol1, protCol2, emptyCol]],
      document,
    );
  }

  // --- Insert all blocks and remove original row ---
  const parent = element.parentNode;
  parent.insertBefore(block1, element);
  if (block2) {
    parent.insertBefore(block2, element);
  }
  if (block3) {
    parent.insertBefore(block3, element);
  }

  element.remove();
}
