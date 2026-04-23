import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Assign classes to the 3 footer bands
  const bands = [...footer.querySelectorAll(':scope > div.section')];
  const contentDivs = bands.length
    ? bands
    : [...footer.children].filter((c) => c.tagName === 'DIV');
  const classes = ['contextual', 'main', 'sub'];
  classes.forEach((c, i) => {
    if (contentDivs[i]) contentDivs[i].classList.add(`footer-${c}`);
  });

  // Strip button classes
  footer.querySelectorAll('.button').forEach((btn) => {
    btn.className = '';
    const bc = btn.closest('.button-container');
    if (bc) bc.className = '';
  });

  block.append(footer);
}
