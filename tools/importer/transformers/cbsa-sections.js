/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: CBSA section breaks.
 * Inserts <hr> elements between content sections based on template section definitions.
 * All selectors verified against captured DOM from https://www.cbsa-asfc.gc.ca/menu-eng.html
 *
 * Template has 10 sections, none with styles, so only <hr> breaks are needed (no Section Metadata).
 * Expected: 9 <hr> elements (one before each section except the first).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Finds the DOM element for a given section definition.
 * Uses the section selector from the template, with fallback text-matching for :contains() selectors.
 * @param {Element} element - The main element
 * @param {Document} document - The document
 * @param {object} section - Section definition from template
 * @returns {Element|null}
 */
function findSectionElement(element, document, section) {
  const sel = section.selector;

  // Section 1 (Intro): h1#wb-cont
  if (section.id === 'section-1') {
    return element.querySelector('h1#wb-cont');
  }

  // Section 2 (Latest News): section containing .gc-nws with direct h2 child
  // Found in captured HTML: <section><h2>Latest</h2><div class="gc-nws row">
  if (section.id === 'section-2') {
    const nws = element.querySelector('.gc-nws');
    if (nws) {
      const parent = nws.closest('section');
      if (parent && parent.querySelector(':scope > h2')) return parent;
    }
    return null;
  }

  // Section 3 (Most Requested Sidebar): first section.lnkbx with direct h2 child
  // Found in captured HTML: <section class="lnkbx"><h2>Most requested</h2>
  if (section.id === 'section-3') {
    const candidates = element.querySelectorAll('section.lnkbx');
    for (const c of candidates) {
      const h2 = c.querySelector(':scope > h2');
      if (h2 && h2.textContent.trim().toLowerCase().includes('most requested')) return c;
    }
    return null;
  }

  // Section 4 (Travel): section.col-md-8 containing first h2 "Travel"
  // Found in captured HTML: <section class="col-md-8 pull-left"><h2>Travel</h2>
  if (section.id === 'section-4') {
    const sec = element.querySelector('section[class*="col-md-8"]');
    if (sec) {
      const h2 = sec.querySelector(':scope > h2');
      if (h2 && h2.textContent.trim() === 'Travel') return h2;
    }
    return null;
  }

  // Section 5 (Trade): section with direct h2 containing "Trade"
  // Found in captured HTML: <section><h2>Trade</h2>
  if (section.id === 'section-5') {
    const allSections = element.querySelectorAll('section');
    for (const s of allSections) {
      const h2 = s.querySelector(':scope > h2');
      if (h2 && h2.textContent.trim() === 'Trade') return s;
    }
    return null;
  }

  // Section 6 (Protecting the Canadian border): section with direct h2 containing "Protecting"
  // Found in captured HTML: <section><h2>Protecting the Canadian border</h2>
  if (section.id === 'section-6') {
    const allSections = element.querySelectorAll('section');
    for (const s of allSections) {
      const h2 = s.querySelector(':scope > h2');
      if (h2 && h2.textContent.trim().startsWith('Protecting')) return s;
    }
    return null;
  }

  // Section 7 (What we are doing): section.col-md-12 with direct h2
  // Found in captured HTML: <section class="col-md-12"><h2>What we are doing</h2>
  if (section.id === 'section-7') {
    const candidates = element.querySelectorAll('section[class*="col-md-12"]');
    for (const c of candidates) {
      const h2 = c.querySelector(':scope > h2');
      if (h2 && h2.textContent.trim().startsWith('What we are doing')) return c;
    }
    return null;
  }

  // Section 8 (Leadership): section.gc-crprt
  // Found in captured HTML: <section class="gc-crprt ">
  if (section.id === 'section-8') {
    return element.querySelector('section.gc-crprt');
  }

  // Section 9 (Corporate Information): section with direct h2 containing "Corporate"
  // Found in captured HTML: <section><h2>Corporate information</h2>
  if (section.id === 'section-9') {
    const allSections = element.querySelectorAll('section');
    for (const s of allSections) {
      const h2 = s.querySelector(':scope > h2');
      if (h2 && h2.textContent.trim().startsWith('Corporate')) return s;
    }
    return null;
  }

  // Section 10 (Features): section.gc-prtts
  // Found in captured HTML: <section class="gc-prtts"><h2>Features</h2>
  if (section.id === 'section-10') {
    return element.querySelector('section.gc-prtts');
  }

  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
    const sections = template.sections;

    // Process sections in reverse order to avoid offset issues when inserting elements
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, document, section);

      if (!sectionEl) continue;

      // Insert Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Insert <hr> before each section except the first one
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
