/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsIntroParser from './parsers/columns-intro.js';
import columnsNewsParser from './parsers/columns-news.js';
import columnsServiceParser from './parsers/columns-service.js';
import cardsLeadershipParser from './parsers/cards-leadership.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsLinksParser from './parsers/columns-links.js';

// TRANSFORMER IMPORTS
import cbsaCleanupTransformer from './transformers/cbsa-cleanup.js';
import cbsaSectionsTransformer from './transformers/cbsa-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-intro': columnsIntroParser,
  'columns-news': columnsNewsParser,
  'columns-service': columnsServiceParser,
  'cards-leadership': cardsLeadershipParser,
  'cards-feature': cardsFeatureParser,
  'columns-links': columnsLinksParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'menu-page',
  description: 'Site menu and navigation landing page with categorized links to CBSA services and information',
  urls: [
    'https://www.cbsa-asfc.gc.ca/menu-eng.html',
  ],
  blocks: [
    {
      name: 'columns-intro',
      instances: [
        'div.row.mrgn-tp-lg',
      ],
    },
    {
      name: 'columns-news',
      instances: [
        'div.gc-nws',
      ],
    },
    {
      name: 'cards-leadership',
      instances: [
        'section.gc-crprt',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        'section.gc-prtts .row > div.col-lg-4',
      ],
    },
    {
      name: 'columns-service',
      instances: [
        'div.row:has(> section.col-md-8.pull-left)',
      ],
    },
    {
      name: 'columns-links',
      instances: [
        'section.col-md-12 .row section.lnkbx',
        'section > h2 + div.row.wb-eqht > div.col-md-6 > section.lnkbx',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Intro',
      selector: 'main > .container > h1#wb-cont',
      style: null,
      blocks: ['columns-intro'],
      defaultContent: ['h1#wb-cont'],
    },
    {
      id: 'section-2',
      name: 'Latest News',
      selector: 'main section:has(> h2:first-child):has(.gc-nws)',
      style: null,
      blocks: ['columns-news'],
      defaultContent: ['section > h2'],
    },
    {
      id: 'section-3',
      name: 'Travel, Trade, Most Requested and Contact Us',
      selector: 'div.row:has(> section.col-md-8.pull-left)',
      style: null,
      blocks: ['columns-service'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'What we are doing',
      selector: 'section.col-md-12:has(> h2)',
      style: null,
      blocks: ['columns-links'],
      defaultContent: ['section.col-md-12 > h2'],
    },
    {
      id: 'section-8',
      name: 'Leadership',
      selector: 'section.gc-crprt',
      style: null,
      blocks: ['cards-leadership'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Corporate Information',
      selector: "section:has(> h2:contains('Corporate'))",
      style: null,
      blocks: ['columns-links'],
      defaultContent: ['section > h2'],
    },
    {
      id: 'section-10',
      name: 'Features',
      selector: 'section.gc-prtts',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['section.gc-prtts > h2'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cbsaCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [cbsaSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
