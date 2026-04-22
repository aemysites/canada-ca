const SOCIAL_ICONS = {
  facebook: 'https://www.cbsa-asfc.gc.ca/_wb/gcweb15.4.0/GCWeb/assets/gc-follow-us/facebook.svg',
  x: 'https://www.cbsa-asfc.gc.ca/_wb/gcweb15.4.0/GCWeb/assets/gc-follow-us/x.svg',
  youtube: 'https://www.cbsa-asfc.gc.ca/_wb/gcweb15.4.0/GCWeb/assets/gc-follow-us/youtube.svg',
  linkedin: 'https://www.cbsa-asfc.gc.ca/_wb/gcweb15.4.0/GCWeb/assets/gc-follow-us/linkedin.svg',
  instagram: 'https://www.cbsa-asfc.gc.ca/_wb/gcweb15.4.0/GCWeb/assets/gc-follow-us/instagram.svg',
};

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-intro-${cols.length}-cols`);

  // Replace social media link text with SVG icons
  block.querySelectorAll('a').forEach((link) => {
    const text = link.textContent.trim().toLowerCase();
    const iconUrl = SOCIAL_ICONS[text];
    if (iconUrl) {
      const alt = link.textContent.trim();
      link.textContent = '';
      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = alt;
      link.appendChild(img);
      link.classList.add('social-icon');
    }
  });
}
