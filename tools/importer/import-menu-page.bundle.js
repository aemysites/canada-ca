var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-menu-page.js
  var import_menu_page_exports = {};
  __export(import_menu_page_exports, {
    default: () => import_menu_page_default
  });

  // tools/importer/parsers/columns-intro.js
  function columnsIntroParser(element, { document }) {
    const textCol = element.querySelector(".col-sm-8");
    const socialCol = element.querySelector(".col-sm-4");
    if (!textCol || !socialCol) return;
    const col1 = document.createElement("div");
    const introP = textCol.querySelector("p");
    if (introP) {
      col1.appendChild(introP.cloneNode(true));
    }
    const col2 = document.createElement("div");
    const followSection = socialCol.querySelector("section.gc-followus");
    if (followSection) {
      const heading = followSection.querySelector("h2");
      if (heading) {
        col2.appendChild(heading.cloneNode(true));
      }
      const linkList = followSection.querySelector("ul");
      if (linkList) {
        const ul = document.createElement("ul");
        linkList.querySelectorAll("li > a").forEach((a) => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = a.href;
          const label = a.querySelector(".wb-inv");
          link.textContent = label ? label.textContent.trim() : a.className.split(" ")[0];
          li.appendChild(link);
          ul.appendChild(li);
        });
        col2.appendChild(ul);
      }
    }
    const cells = [
      ["Columns Intro"],
      [col1, col2]
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-news.js
  function columnsNewsParser(element, { document }) {
    const newsItems = element.querySelectorAll(".col-md-8 > .row > .col-md-6");
    const feedCol = element.querySelector(".col-md-4.wb-feeds") || element.querySelector(":scope > .col-md-4");
    if (newsItems.length < 2) return;
    const columns = [];
    newsItems.forEach((item) => {
      const col = document.createElement("div");
      const img = item.querySelector("img");
      if (img) {
        const pic = document.createElement("img");
        pic.src = img.src;
        pic.alt = img.alt || "";
        col.appendChild(pic);
      }
      const link = item.querySelector("a");
      if (link) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        const titleP = link.querySelector("p");
        a.textContent = titleP ? titleP.textContent.trim() : link.textContent.trim();
        const strong = document.createElement("strong");
        strong.appendChild(a);
        p.appendChild(strong);
        col.appendChild(p);
      }
      const desc = item.querySelector(":scope > p");
      if (desc) {
        col.appendChild(desc.cloneNode(true));
      }
      columns.push(col);
    });
    const col3 = document.createElement("div");
    if (feedCol) {
      const feedList = feedCol.querySelector("ul");
      if (feedList) {
        const ul = document.createElement("ul");
        feedList.querySelectorAll("li").forEach((li) => {
          const newLi = document.createElement("li");
          const a = li.querySelector("a");
          if (a) {
            const link = document.createElement("a");
            link.href = a.href;
            link.textContent = a.textContent.trim();
            newLi.appendChild(link);
          }
          ul.appendChild(newLi);
        });
        col3.appendChild(ul);
      }
      const allNewsLink = feedCol.querySelector("p > strong > a");
      if (allNewsLink) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        const a = document.createElement("a");
        a.href = allNewsLink.href;
        a.textContent = allNewsLink.textContent.trim();
        strong.appendChild(a);
        p.appendChild(strong);
        col3.appendChild(p);
      }
    }
    columns.push(col3);
    const cells = [
      ["Columns News"],
      columns
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-service.js
  function parse(element, { document }) {
    const leftSection = element.querySelector("section.col-md-8.pull-left");
    const mostRequestedCol = element.querySelector(".col-md-4.pull-right");
    if (!leftSection || !mostRequestedCol) return;
    function buildDoormat(doormat) {
      const div = document.createElement("div");
      const heading = doormat.querySelector("h3, h2, h4");
      if (heading) div.appendChild(heading.cloneNode(true));
      const desc = doormat.querySelector("p");
      if (desc) div.appendChild(desc.cloneNode(true));
      return div;
    }
    function splitDoormats(doormats, splitAt) {
      const col1 = document.createElement("div");
      const col2 = document.createElement("div");
      doormats.forEach((d, i) => {
        (i < splitAt ? col1 : col2).appendChild(buildDoormat(d));
      });
      return [col1, col2];
    }
    const travelHeading = leftSection.querySelector(":scope > h2");
    const travelGrid = leftSection.querySelector(":scope > div.wb-eqht");
    const travelDoormats = travelGrid ? travelGrid.querySelectorAll(".gc-drmt") : [];
    const [travelCol1, travelCol2] = splitDoormats(travelDoormats, 2);
    if (travelHeading) {
      travelCol1.insertBefore(travelHeading.cloneNode(true), travelCol1.firstChild);
    }
    const mrCol = document.createElement("div");
    const lnkbx = mostRequestedCol.querySelector("section.lnkbx");
    if (lnkbx) {
      const h = lnkbx.querySelector("h2");
      if (h) mrCol.appendChild(h.cloneNode(true));
      const ul = lnkbx.querySelector("ul");
      if (ul) mrCol.appendChild(ul.cloneNode(true));
    }
    const block1 = WebImporter.DOMUtils.createTable(
      [["Columns Service"], [travelCol1, travelCol2, mrCol]],
      document
    );
    const childSections = leftSection.querySelectorAll(":scope > section");
    let tradeSection = null;
    let protectingSection = null;
    childSections.forEach((s) => {
      const h = s.querySelector("h2");
      if (!h) return;
      const text = h.textContent.trim().toLowerCase();
      if (text.includes("trade")) tradeSection = s;
      else if (text.includes("protecting")) protectingSection = s;
    });
    let contactLnkbx = null;
    element.querySelectorAll(".col-md-4 section.lnkbx").forEach((s) => {
      const h = s.querySelector("h2");
      if (h && h.textContent.trim().toLowerCase().includes("contact")) {
        contactLnkbx = s;
      }
    });
    let block2 = null;
    if (tradeSection) {
      const tradeHeading = tradeSection.querySelector("h2");
      const tradeDoormats = tradeSection.querySelectorAll(".gc-drmt");
      const [tradeCol1, tradeCol2] = splitDoormats(tradeDoormats, 3);
      if (tradeHeading) {
        tradeCol1.insertBefore(tradeHeading.cloneNode(true), tradeCol1.firstChild);
      }
      const cuCol = document.createElement("div");
      if (contactLnkbx) {
        const ch = contactLnkbx.querySelector("h2");
        if (ch) cuCol.appendChild(ch.cloneNode(true));
        const cp = contactLnkbx.querySelector("p");
        if (cp) cuCol.appendChild(cp.cloneNode(true));
      }
      block2 = WebImporter.DOMUtils.createTable(
        [["Columns Service"], [tradeCol1, tradeCol2, cuCol]],
        document
      );
    }
    let block3 = null;
    if (protectingSection) {
      const protHeading = protectingSection.querySelector("h2");
      const protDoormats = protectingSection.querySelectorAll(".gc-drmt");
      const [protCol1, protCol2] = splitDoormats(protDoormats, 2);
      if (protHeading) {
        protCol1.insertBefore(protHeading.cloneNode(true), protCol1.firstChild);
      }
      const emptyCol = document.createElement("div");
      block3 = WebImporter.DOMUtils.createTable(
        [["Columns Service"], [protCol1, protCol2, emptyCol]],
        document
      );
    }
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

  // tools/importer/parsers/cards-leadership.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll(".wb-eqht > section.col-md-4");
    if (items.length === 0) return;
    const cells = [];
    items.forEach((item) => {
      const imgCell = document.createElement("div");
      const textCell = document.createElement("div");
      const img = item.querySelector("img");
      if (img) {
        const pic = document.createElement("img");
        pic.src = img.src;
        pic.alt = img.alt || "";
        imgCell.appendChild(pic);
      }
      const role = item.querySelector("h3");
      if (role) {
        const p = document.createElement("p");
        p.textContent = role.textContent.trim();
        const strong = document.createElement("strong");
        strong.textContent = p.textContent;
        p.textContent = "";
        p.appendChild(strong);
        textCell.appendChild(p);
      }
      const caption = item.querySelector("figcaption");
      if (caption) {
        const p = document.createElement("p");
        p.textContent = caption.textContent.trim();
        textCell.appendChild(p);
      }
      const titleP = item.querySelector(":scope > p");
      if (titleP) {
        const p = document.createElement("p");
        p.textContent = titleP.textContent.trim();
        textCell.appendChild(p);
      }
      const link = item.querySelector("a");
      if (link && caption) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = caption.textContent.trim();
        p.appendChild(a);
        textCell.appendChild(p);
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.DOMUtils.createTable(
      [["Cards Leadership"], ...cells],
      document
    );
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document }) {
    const cells = [];
    const img = element.querySelector("img");
    const link = element.querySelector("a");
    const figcaption = element.querySelector("figcaption");
    const figure = element.querySelector("figure");
    const imageCell = [];
    if (img) {
      const imgClone = img.cloneNode(true);
      imageCell.push(imgClone);
    }
    const textCell = [];
    const isLeadership = !!element.querySelector(":scope > h3");
    const hasFigure = !!figure;
    const hasDirectDescP = !!element.querySelector(":scope > p");
    if (isLeadership) {
      const roleHeading = element.querySelector(":scope > h3");
      const name = figcaption ? figcaption.textContent.trim() : "";
      const descP = element.querySelector(":scope > p");
      if (roleHeading) {
        const heading = document.createElement("strong");
        heading.textContent = roleHeading.textContent.trim();
        textCell.push(heading);
      }
      if (name) {
        const nameP = document.createElement("p");
        nameP.textContent = name;
        textCell.push(nameP);
      }
      if (descP) {
        const desc = document.createElement("p");
        desc.textContent = descP.textContent.trim();
        textCell.push(desc);
      }
      if (link && link.href) {
        const ctaLink = document.createElement("a");
        ctaLink.href = link.href;
        ctaLink.textContent = name || link.textContent.trim();
        textCell.push(ctaLink);
      }
    } else if (hasFigure && !hasDirectDescP) {
      const title = figcaption ? figcaption.textContent.trim() : "";
      const descP = link ? link.querySelector(":scope > p") : null;
      if (title) {
        const heading = document.createElement("strong");
        heading.textContent = title;
        textCell.push(heading);
      }
      if (descP) {
        const desc = document.createElement("p");
        desc.textContent = descP.textContent.trim();
        textCell.push(desc);
      }
      if (link && link.href) {
        const ctaLink = document.createElement("a");
        ctaLink.href = link.href;
        ctaLink.textContent = title || link.textContent.trim();
        textCell.push(ctaLink);
      }
    } else {
      const titleP = link ? link.querySelector("p") : null;
      const title = titleP ? titleP.textContent.trim() : "";
      const descP = element.querySelector(":scope > p");
      if (title) {
        const heading = document.createElement("strong");
        heading.textContent = title;
        textCell.push(heading);
      }
      if (descP) {
        const desc = document.createElement("p");
        desc.textContent = descP.textContent.trim();
        textCell.push(desc);
      }
      if (link && link.href) {
        const ctaLink = document.createElement("a");
        ctaLink.href = link.href;
        ctaLink.textContent = title || link.textContent.trim();
        textCell.push(ctaLink);
      }
    }
    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : "", textCell.length > 0 ? textCell : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-links.js
  function parse4(element, { document }) {
    const colWrapper = element.closest('[class*="col-md-"]');
    const rowContainer = colWrapper ? colWrapper.closest(".row") : null;
    if (rowContainer && rowContainer.getAttribute("data-columns-links-done")) {
      element.remove();
      return;
    }
    if (rowContainer) {
      rowContainer.setAttribute("data-columns-links-done", "true");
    }
    const lnkbxSections = rowContainer ? Array.from(rowContainer.querySelectorAll("section.lnkbx")) : [element];
    const columnCells = lnkbxSections.map((section) => {
      const cellContent = [];
      const heading = section.querySelector(":scope > h3, :scope > h5, :scope > h2");
      if (heading) {
        cellContent.push(heading.cloneNode(true));
      }
      const list = section.querySelector(":scope > ul");
      if (list) {
        cellContent.push(list.cloneNode(true));
      }
      const clearfix = section.querySelector(":scope > div.clearfix");
      if (clearfix) {
        const viewAllLink = clearfix.querySelector("a");
        if (viewAllLink && viewAllLink.textContent.trim()) {
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          strong.appendChild(viewAllLink.cloneNode(true));
          p.appendChild(strong);
          cellContent.push(p);
        }
      }
      return cellContent;
    });
    const cells = [columnCells];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-links",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cbsa-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "section.mfp-hide"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer#wb-info",
        "nav:has(> ul#wb-tphp)",
        "section.pagedetails",
        "#wb-rsz",
        "link",
        "datalist",
        "meta",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/cbsa-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElement(element, document, section) {
    const sel = section.selector;
    if (section.id === "section-1") {
      return element.querySelector("h1#wb-cont");
    }
    if (section.id === "section-2") {
      const nws = element.querySelector(".gc-nws");
      if (nws) {
        const parent = nws.closest("section");
        if (parent && parent.querySelector(":scope > h2")) return parent;
      }
      return null;
    }
    if (section.id === "section-3") {
      const candidates = element.querySelectorAll("section.lnkbx");
      for (const c of candidates) {
        const h2 = c.querySelector(":scope > h2");
        if (h2 && h2.textContent.trim().toLowerCase().includes("most requested")) return c;
      }
      return null;
    }
    if (section.id === "section-4") {
      const sec = element.querySelector('section[class*="col-md-8"]');
      if (sec) {
        const h2 = sec.querySelector(":scope > h2");
        if (h2 && h2.textContent.trim() === "Travel") return h2;
      }
      return null;
    }
    if (section.id === "section-5") {
      const allSections = element.querySelectorAll("section");
      for (const s of allSections) {
        const h2 = s.querySelector(":scope > h2");
        if (h2 && h2.textContent.trim() === "Trade") return s;
      }
      return null;
    }
    if (section.id === "section-6") {
      const allSections = element.querySelectorAll("section");
      for (const s of allSections) {
        const h2 = s.querySelector(":scope > h2");
        if (h2 && h2.textContent.trim().startsWith("Protecting")) return s;
      }
      return null;
    }
    if (section.id === "section-7") {
      const candidates = element.querySelectorAll('section[class*="col-md-12"]');
      for (const c of candidates) {
        const h2 = c.querySelector(":scope > h2");
        if (h2 && h2.textContent.trim().startsWith("What we are doing")) return c;
      }
      return null;
    }
    if (section.id === "section-8") {
      return element.querySelector("section.gc-crprt");
    }
    if (section.id === "section-9") {
      const allSections = element.querySelectorAll("section");
      for (const s of allSections) {
        const h2 = s.querySelector(":scope > h2");
        if (h2 && h2.textContent.trim().startsWith("Corporate")) return s;
      }
      return null;
    }
    if (section.id === "section-10") {
      return element.querySelector("section.gc-prtts");
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSectionElement(element, document, section);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-menu-page.js
  var parsers = {
    "columns-intro": columnsIntroParser,
    "columns-news": columnsNewsParser,
    "columns-service": parse,
    "cards-leadership": parse2,
    "cards-feature": parse3,
    "columns-links": parse4
  };
  var PAGE_TEMPLATE = {
    name: "menu-page",
    description: "Site menu and navigation landing page with categorized links to CBSA services and information",
    urls: [
      "https://www.cbsa-asfc.gc.ca/menu-eng.html"
    ],
    blocks: [
      {
        name: "columns-intro",
        instances: [
          "div.row.mrgn-tp-lg"
        ]
      },
      {
        name: "columns-news",
        instances: [
          "div.gc-nws"
        ]
      },
      {
        name: "cards-leadership",
        instances: [
          "section.gc-crprt"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          "section.gc-prtts .row > div.col-lg-4"
        ]
      },
      {
        name: "columns-service",
        instances: [
          "div.row:has(> section.col-md-8.pull-left)"
        ]
      },
      {
        name: "columns-links",
        instances: [
          "section.col-md-12 .row section.lnkbx",
          "section > h2 + div.row.wb-eqht > div.col-md-6 > section.lnkbx"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Intro",
        selector: "main > .container > h1#wb-cont",
        style: null,
        blocks: ["columns-intro"],
        defaultContent: ["h1#wb-cont"]
      },
      {
        id: "section-2",
        name: "Latest News",
        selector: "main section:has(> h2:first-child):has(.gc-nws)",
        style: null,
        blocks: ["columns-news"],
        defaultContent: ["section > h2"]
      },
      {
        id: "section-3",
        name: "Travel, Trade, Most Requested and Contact Us",
        selector: "div.row:has(> section.col-md-8.pull-left)",
        style: null,
        blocks: ["columns-service"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "What we are doing",
        selector: "section.col-md-12:has(> h2)",
        style: null,
        blocks: ["columns-links"],
        defaultContent: ["section.col-md-12 > h2"]
      },
      {
        id: "section-8",
        name: "Leadership",
        selector: "section.gc-crprt",
        style: null,
        blocks: ["cards-leadership"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Corporate Information",
        selector: "section:has(> h2:contains('Corporate'))",
        style: null,
        blocks: ["columns-links"],
        defaultContent: ["section > h2"]
      },
      {
        id: "section-10",
        name: "Features",
        selector: "section.gc-prtts",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["section.gc-prtts > h2"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_menu_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_menu_page_exports);
})();
