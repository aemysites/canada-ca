/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: CBSA site-wide cleanup.
 * Removes non-authorable Government of Canada WET framework elements.
 * All selectors verified against captured DOM from https://www.cbsa-asfc.gc.ca/menu-eng.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove hidden modal overlays that could interfere with block parsing
    // Found in captured HTML: <section id="twitter" class="mfp-hide modal-dialog modal-content overlay-def">
    WebImporter.DOMUtils.remove(element, [
      'section.mfp-hide',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove Government of Canada header (banner, search, mega-menu, breadcrumbs)
    // Found in captured HTML: <header> containing #wb-bnr, #wb-srch, .gcweb-menu, #wb-bc
    // Remove Government of Canada footer
    // Found in captured HTML: <footer id="wb-info">
    // Remove skip navigation links
    // Found in captured HTML: <nav> > <ul id="wb-tphp">
    // Remove page details section (date modified)
    // Found in captured HTML: <section class="pagedetails container">
    // Remove WET resize indicator
    // Found in captured HTML: <span id="wb-rsz">
    // Remove leftover link, datalist, meta elements
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer#wb-info',
      'nav:has(> ul#wb-tphp)',
      'section.pagedetails',
      '#wb-rsz',
      'link',
      'datalist',
      'meta',
      'noscript',
    ]);
  }
}
