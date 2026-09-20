/* 天津沃昌机械设备有限公司 · 官网前端
   内容来自 /content/*.json：在线访问时实时读取，直接双击本地文件时使用页面内嵌的快照。 */

(function () {
  "use strict";

  var FALLBACK_MAIL = "quanzidong006@163.com";

  var ICONS = {
    robot:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4M9 4h6M9 13h.01M15 13h.01M9 16h6"/></svg>',
    plant:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18M5 20V9l5-3 5 3v11M15 20V12h4v8"/><path d="M8 12h.01M8 15h.01"/></svg>',
    conveyor:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="2.4"/><circle cx="18" cy="17" r="2.4"/><path d="M6 14.6h12M4 10h11l3-3H7z"/></svg>',
    parts:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5l2.6-1.5M17.2 9l2.6-1.5"/><circle cx="12" cy="12" r="3.4"/></svg>'
  };

  function esc(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function mount(id, html) {
    var node = document.getElementById(id);
    if (node) node.innerHTML = html;
    return node;
  }

  function embedded(name) {
    var node = document.getElementById("page-data-" + name);
    if (!node) return null;
    try {
      return JSON.parse(node.textContent);
    } catch (err) {
      return null;
    }
  }

  function load(name) {
    var url = "content/" + name + ".json";
    return fetch(url, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function () {
        var fallback = embedded(name);
        if (fallback) return fallback;
        throw new Error("无法读取内容：" + name);
      });
  }

  /* ---------------- 顶部导航与页脚 ---------------- */

  function currentPage() {
    var file = window.location.pathname.split("/").pop();
    return file && file.length ? file : "index.html";
  }

  function renderHeader(site) {
    var here = currentPage();
    var links = (site.nav || [])
      .map(function (item) {
        var active = item.href === here ? ' aria-current="page"' : "";
        return '<a href="' + esc(item.href) + '"' + active + ">" + esc(item.label) + "</a>";
      })
      .join("");

    var header = $(".site-header");
    if (!header) return;
    header.innerHTML =
      '<div class="wrap">' +
      '<a class="brand" href="index.html" aria-label="' +
      esc(site.companyName) +
      ' 首页">' +
      '<img src="assets/img/logo.png" alt="' +
      esc(site.companyName) +
      '">' +
      "</a>" +
      '<nav class="site-nav" aria-label="主导航">' +
      links +
      "</nav>" +
      '<div class="header-actions">' +
      '<a class="btn btn--primary header-cta" href="' +
      esc((site.headerCta || {}).href || "contact.html") +
      '">' +
      esc((site.headerCta || {}).label || "联系我们") +
      "</a>" +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="打开菜单"><span></span></button>' +
      "</div>" +
      "</div>";

    var mnav = document.createElement("div");
    mnav.className = "mobile-nav";
    mnav.id = "mobile-nav";
    mnav.innerHTML =
      links +
      '<a class="btn btn--primary" href="' +
      esc((site.headerCta || {}).href || "contact.html") +
      '">' +
      esc((site.headerCta || {}).label || "联系我们") +
      "</a>";
    document.body.appendChild(mnav);

    var toggle = $(".nav-toggle", header);
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      mnav.classList.toggle("is-open", !open);
      document.documentElement.style.overflow = open ? "" : "hidden";
    });

    mnav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        toggle.setAttribute("aria-expanded", "false");
        mnav.classList.remove("is-open");
        document.documentElement.style.overflow = "";
      }
    });
  }

  function renderFooter(site, contact) {
    var node = $(".site-footer");
    if (!node) return;
    var links = (site.nav || [])
      .map(function (item) {
        return '<li><a href="' + esc(item.href) + '">' + esc(item.label) + "</a></li>";
      })
      .join("");
    var primary = (contact && contact.primary) || {};
    var address = (contact && contact.address) || {};
    node.innerHTML =
      '<div class="wrap">' +
      '<div class="footer-grid">' +
      "<div>" +
      '<img class="footer-logo" src="assets/img/logo-on-dark.png" alt="' +
      esc(site.companyName) +
      '">' +
      '<p style="margin-top:16px;max-width:26em;color:rgba(255,255,255,0.62);font-size:0.92rem;">' +
      esc(site.slogan || "") +
      "</p>" +
      "</div>" +
      "<div><h4>" +
      esc((site.footer || {}).quickLinksTitle || "快速导航") +
      "</h4><ul class=\"footer-links\">" +
      links +
      "</ul></div>" +
      "<div><h4>" +
      esc((site.footer || {}).contactTitle || "联系方式") +
      '</h4><ul class="footer-contact">' +
      (primary.name
        ? '<li><a href="tel:' + esc(primary.mobile) + '">' + esc(primary.name) + " " + esc(primary.mobile) + "</a></li>"
        : "") +
      (primary.phone
        ? '<li><a href="tel:' + esc(primary.phone) + '">总机 ' + esc(primary.phone) + "</a></li>"
        : "") +
      (primary.email ? "<li><a>" + esc(primary.email) + "</a></li>" : "") +
      (address.text ? "<li>" + esc(address.text) + "</li>" : "") +
      "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom"><span>© ' +
      new Date().getFullYear() +
      " " +
      esc(site.companyName) +
      "</span><span>" +
      esc(site.companyNameEn || "") +
      "</span></div>" +
      "</div>";
  }

  function fixMailLinks(contact) {
    var mail = ((contact || {}).primary || {}).email || FALLBACK_MAIL;
    $$("a").forEach(function (a) {
      var text = a.textContent.trim();
      if (text === mail || /^[\w.+-]+@[\w.-]+$/.test(text)) {
        a.setAttribute("href", "mailto:" + text);
      }
    });
  }

  /* ---------------- 通用渲染 ---------------- */

  function productCard(product) {
    var cover = (product.images || [])[0] || {};
    return (
      '<article class="card reveal">' +
      '<div class="card__media"><img src="' +
      esc(cover.src || "") +
      '" alt="' +
      esc(product.name) +
      '" loading="lazy">' +
      (product.category ? '<span class="card__tag">' + esc(product.category) + "</span>" : "") +
      "</div>" +
      '<div class="card__body">' +
      '<h3 class="card__title">' +
      esc(product.name) +
      "</h3>" +
      (product.nameEn ? '<p class="card__en">' + esc(product.nameEn) + "</p>" : "") +
      '<p class="card__desc">' +
      esc(product.summary) +
      "</p>" +
      '<div class="card__foot"><a class="text-link" href="products.html#' +
      esc(product.slug) +
      '">查看详情 →</a></div>' +
      "</div></article>"
    );
  }

  function statCard(stat) {
    return (
      '<div class="stat reveal">' +
      '<div class="stat__value">' +
      esc(stat.value) +
      '<span class="stat__unit">' +
      esc(stat.unit || "") +
      "</span></div>" +
      '<p class="stat__label">' +
      esc(stat.label) +
      "</p></div>"
    );
  }

  function capabilityCard(item) {
    return (
      '<article class="cap-card reveal">' +
      '<div class="cap-card__icon">' +
      (ICONS[item.icon] || ICONS.robot) +
      "</div>" +
      "<h3>" +
      esc(item.title) +
      "</h3><p>" +
      esc(item.desc) +
      "</p></article>"
    );
  }

  /* ---------------- 首页 ---------------- */

  function renderHome(site, about, products, contact) {
    var hero = site.hero || {};
    mount(
      "hero-slot",
      '<div class="hero__text">' +
        '<span class="hero__eyebrow">' +
        esc(hero.eyebrow || "") +
        "</span>" +
        "<h1>" +
        esc(hero.title || "") +
        "</h1>" +
        '<p class="hero__sub">' +
        esc(hero.subtitle || "") +
        "</p>" +
        '<ul class="hero__badges">' +
        (site.capabilities || [])
          .slice(0, 4)
          .map(function (c) {
            return "<li>" + esc(c.title) + "</li>";
          })
          .join("") +
        "</ul>" +
        '<div class="btn-row">' +
        '<a class="btn btn--glass-orange" href="' +
        esc((hero.primaryCta || {}).href || "products.html") +
        '">' +
        esc((hero.primaryCta || {}).label || "查看产品中心") +
        "</a>" +
        '<a class="btn btn--glass" href="' +
        esc((hero.secondaryCta || {}).href || "about.html") +
        '">' +
        esc((hero.secondaryCta || {}).label || "了解沃昌") +
        "</a>" +
        "</div></div>" +
        '<div class="hero__media"><figure><img src="' +
        esc(hero.image || "") +
        '" alt="' +
        esc(hero.imageCaption || "") +
        '" fetchpriority="high"><figcaption>' +
        esc(hero.imageCaption || "") +
        "</figcaption></figure></div>"
    );

    mount(
      "stats-slot",
      (site.stats || []).map(statCard).join("") +
        (site.statsNote ? '<p class="note" style="grid-column:1/-1">' + esc(site.statsNote) + "</p>" : "")
    );

    var homeAbout = site.homeAbout || {};
    mount(
      "about-slot",
      '<div class="reveal">' +
        '<span class="eyebrow">About Wochang</span>' +
        '<h2 class="h2">' +
        esc(homeAbout.title || "") +
        '</h2><div class="prose" style="margin-top:18px">' +
        (homeAbout.paragraphs || [])
          .map(function (p) {
            return "<p>" + esc(p) + "</p>";
          })
          .join("") +
        "</div><ul class=\"check-list\">" +
        (homeAbout.points || [])
          .map(function (p) {
            return "<li>" + esc(p) + "</li>";
          })
          .join("") +
        "</ul></div>" +
        '<div class="reveal"><h3 class="h3">数字化看业绩</h3>' +
        '<ul class="fact-list" style="margin-top:20px">' +
        ((about.performance || {}).highlights || [])
          .map(function (h) {
            return (
              "<li><strong>" +
              esc(h.value) +
              esc(h.unit || "") +
              "</strong><span>" +
              esc(h.label) +
              "</span></li>"
            );
          })
          .join("") +
        "</ul></div>"
    );

    mount(
      "products-slot",
      (products || [])
        .filter(function (p) {
          return p.status !== "hidden" && p.featured;
        })
        .slice(0, 6)
        .map(productCard)
        .join("")
    );

    mount(
      "capabilities-slot",
      (site.capabilities || []).map(capabilityCard).join("")
    );

    var after = site.afterSale || {};
    mount(
      "aftersale-slot",
      '<div class="section-head reveal">' +
        '<span class="eyebrow">Service</span>' +
        '<h2 class="h2">' +
        esc(after.title || "售后服务") +
        '</h2></div><div class="grid grid--2">' +
        (after.items || [])
          .map(function (item) {
            return (
              '<article class="card reveal" style="padding:26px"><h3 class="card__title">' +
              esc(item.title) +
              '</h3><p style="margin-top:12px;color:var(--gray-600)">' +
              esc(item.desc) +
              "</p></article>"
            );
          })
          .join("") +
        "</div>"
    );
  }

  /* ---------------- 企业简介 ---------------- */

  function renderAbout(about) {
    mount(
      "intro-slot",
      '<div class="reveal"><div class="prose">' +
        (about.intro || [])
          .map(function (p) {
            return "<p>" + esc(p) + "</p>";
          })
          .join("") +
        "</div></div>" +
        '<figure class="reveal"><img src="' +
        esc(about.introImage || "") +
        '" alt="' +
        esc(about.title || "") +
        '" loading="lazy"></figure>'
    );

    var perf = about.performance || {};
    mount(
      "performance-slot",
      '<div class="reveal"><span class="eyebrow">Performance</span><h2 class="h2">' +
        esc(perf.title || "公司业绩") +
        '</h2><div class="prose" style="margin-top:18px">' +
        (perf.paragraphs || [])
          .map(function (p) {
            return "<p>" + esc(p) + "</p>";
          })
          .join("") +
        '</div><div class="grid grid--3" style="margin-top:30px">' +
        (perf.highlights || [])
          .map(function (h) {
            return (
              '<div class="stat"><div class="stat__value">' +
              esc(h.value) +
              '<span class="stat__unit">' +
              esc(h.unit || "") +
              "</span></div><p class=\"stat__label\">" +
              esc(h.label) +
              "</p></div>"
            );
          })
          .join("") +
        "</div></div>"
    );

    var mix = about.productMix || {};
    var max = (mix.items || []).reduce(function (m, i) {
      return Math.max(m, i.value || 0);
    }, 1);
    mount(
      "mix-slot",
      '<div class="reveal"><h3 class="h3">' +
        esc(mix.title || "设备构成") +
        '</h3><div class="mix-list" style="margin-top:22px">' +
        (mix.items || [])
          .map(function (i) {
            var pct = Math.round(((i.value || 0) / max) * 100);
            return (
              '<div class="mix-item"><span class="mix-item__label">' +
              esc(i.label) +
              '</span><span class="mix-item__bar"><span style="width:' +
              pct +
              '%"></span></span><span class="mix-item__value">' +
              esc(i.display || i.value) +
              "</span></div>"
            );
          })
          .join("") +
        '</div><p class="note">' +
        esc(mix.note || "") +
        "</p></div>"
    );

    var culture = about.culture || {};
    mount(
      "culture-slot",
      (culture.items || [])
        .map(function (item) {
          return (
            '<article class="culture-card reveal"><span class="culture-card__label">' +
            esc(item.title) +
            '</span><p class="culture-card__text">' +
            esc(item.desc) +
            "</p></article>"
          );
        })
        .join("")
    );

    var team = about.team || {};
    mount(
      "team-slot",
      '<div class="reveal"><span class="eyebrow">Team</span><h2 class="h2">' +
        esc(team.title || "团队介绍") +
        '</h2><div class="prose" style="margin-top:18px">' +
        (team.paragraphs || [])
          .map(function (p) {
            return "<p>" + esc(p) + "</p>";
          })
          .join("") +
        "</div></div>" +
        (team.image
          ? '<figure class="reveal" style="margin:0"><img src="' +
            esc(team.image) +
            '" alt="团队" loading="lazy" style="width:100%;border-radius:var(--r-lg);aspect-ratio:4/3;object-fit:cover;box-shadow:var(--shadow-2)"></figure>'
          : "")
    );

    var timeline = about.timeline || {};
    mount(
      "timeline-slot",
      '<div class="reveal"><span class="eyebrow">Milestones</span><h2 class="h2">' +
        esc(timeline.title || "发展历程") +
        '</h2><ul class="timeline" style="margin-top:26px">' +
        (timeline.items || [])
          .map(function (item) {
            return (
              '<li><span class="timeline__year">' +
              esc(item.year) +
              '</span><p class="timeline__text">' +
              esc(item.text) +
              "</p></li>"
            );
          })
          .join("") +
        "</ul></div>"
    );
  }

  /* ---------------- 产品中心 ---------------- */

  function renderProducts(products) {
    var live = (products || []).filter(function (p) {
      return p.status !== "hidden";
    });

    var categories = ["全部"];
    live.forEach(function (p) {
      if (p.category && categories.indexOf(p.category) === -1) categories.push(p.category);
    });

    mount(
      "filter-slot",
      categories
        .map(function (cat, index) {
          return (
            '<button class="chip" type="button" data-filter="' +
            esc(cat) +
            '" aria-pressed="' +
            (index === 0 ? "true" : "false") +
            '">' +
            esc(cat) +
            "</button>"
          );
        })
        .join("")
    );

    mount("products-slot", live.map(productBlock).join(""));

    $$("#filter-slot .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        $$("#filter-slot .chip").forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        var filter = chip.getAttribute("data-filter");
        $$("[data-category]").forEach(function (block) {
          var show = filter === "全部" || block.getAttribute("data-category") === filter;
          block.hidden = !show;
        });
      });
    });
  }

  function productBlock(product) {
    var images = product.images || [];
    function isLogo(src) {
      return /\/partners\/|\/customers\//.test(src || "");
    }
    var gallery =
      images.length > 1
        ? '<div class="gallery__thumbs">' +
          images
            .map(function (img, index) {
              return (
                '<button type="button" data-index="' +
                index +
                '" aria-current="' +
                (index === 0 ? "true" : "false") +
                '"><img class="' +
                (isLogo(img.src) ? "is-contain" : "") +
                '" src="' +
                esc(img.src) +
                '" alt="' +
                esc(product.name) +
                " 图 " +
                (index + 1) +
                '" loading="lazy"></button>'
              );
            })
            .join("") +
          "</div>"
        : "";

    var specs = (product.specs || []).length
      ? '<dl class="spec-list">' +
        product.specs
          .map(function (s) {
            return (
              "<div><dt>" + esc(s.label) + "</dt><dd>" + esc(s.value) + "</dd></div>"
            );
          })
          .join("") +
        "</dl>"
      : "";

    return (
      '<article class="product-block reveal" id="' +
      esc(product.slug) +
      '" data-category="' +
      esc(product.category || "") +
      '">' +
      '<div class="product-block__media"><div class="gallery" data-gallery>' +
      '<div class="gallery__main' +
      (isLogo((images[0] || {}).src) ? " is-contain" : "") +
      '"><img src="' +
      esc((images[0] || {}).src || "") +
      '" alt="' +
      esc(product.name) +
      '" loading="lazy"></div>' +
      gallery +
      "</div></div>" +
      '<div class="product-block__body">' +
      (product.category ? '<span class="eyebrow">' + esc(product.category) + "</span>" : "") +
      "<h2 class=\"h3\" style=\"font-size:1.5rem\">" +
      esc(product.name) +
      "</h2>" +
      (product.nameEn ? '<p class="card__en" style="margin-top:6px">' + esc(product.nameEn) + "</p>" : "") +
      '<div class="prose" style="margin-top:16px">' +
      (product.description || [])
        .map(function (p) {
          return "<p>" + esc(p) + "</p>";
        })
        .join("") +
      "</div>" +
      ((product.features || []).length
        ? '<ul class="check-list">' +
          product.features
            .map(function (f) {
              return "<li>" + esc(f) + "</li>";
            })
            .join("") +
          "</ul>"
        : "") +
      specs +
      "</div></article>"
    );
  }

  function wireGalleries() {
    $$("[data-gallery]").forEach(function (gallery) {
      var main = $(".gallery__main img", gallery);
      var buttons = $$(".gallery__thumbs button", gallery);
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var img = $("img", btn);
          if (!img) return;
          main.src = img.src;
          main.alt = img.alt;
          buttons.forEach(function (b) {
            b.setAttribute("aria-current", b === btn ? "true" : "false");
          });
        });
      });
    });
  }

  /* ---------------- 客户与案例 ---------------- */

  function renderCases(data) {
    var summary = data.summary || {};
    mount(
      "summary-slot",
      [
        { value: summary.total, unit: summary.unit, label: "成套装箱设备交付（" + (summary.period || "") + "）" },
        { value: summary.customers, unit: "家", label: "有清单可查的签约客户" },
        { value: (data.cities || []).length, unit: "座", label: "已服务城市（含品牌未标注地区）" }
      ]
        .map(statCard)
        .join("") + '<p class="note" style="grid-column:1/-1">' + esc(summary.note || "") + "</p>"
    );

    var map = data.map || {};
    mount(
      "map-head",
      '<span class="eyebrow">Coverage</span><h2 class="h2">' +
        esc(map.title || "客户分布") +
        '</h2><p class="lead">' +
        esc(map.desc || "") +
        "</p>"
    );
    mount(
      "map-legend",
      (map.legend || [])
        .map(function (item) {
          return (
            '<li><i style="background:' +
            esc(item.color) +
            '"></i>' +
            esc(item.label) +
            "</li>"
          );
        })
        .join("")
    );
    mount(
      "map-note",
      esc(map.note || "")
    );
    mount(
      "map-cities",
      (data.cities || [])
        .map(function (city) {
          return "<span>" + esc(city.name) + "</span>";
        })
        .join("")
    );

    var customers = data.customers || {};
    mount(
      "customers-slot",
      '<div class="section-head reveal"><h2 class="h2">' +
        esc(customers.title || "典型客户") +
        '</h2><p class="lead">' +
        esc(customers.note || "") +
        '</p></div><div class="customer-wall reveal">' +
        (customers.items || [])
          .map(function (item) {
            return (
              '<div><img src="' +
              esc(item.logo) +
              '" alt="' +
              esc(item.name) +
              '" loading="lazy"></div>'
            );
          })
          .join("") +
        "</div>"
    );

    var projects = data.projects || {};
    mount(
      "projects-head",
      '<span class="eyebrow">Projects</span><h2 class="h2">' +
        esc(projects.title || "历史项目清单") +
        '</h2><p class="lead">' +
        esc(projects.desc || "") +
        "</p>"
    );
    var filterButtons = (projects.filters || [{ label: "全部", value: "all" }])
      .map(function (f, index) {
        return (
          '<button class="chip" type="button" data-model="' +
          esc(f.value) +
          '" aria-pressed="' +
          (index === 0 ? "true" : "false") +
          '">' +
          esc(f.label) +
          "</button>"
        );
      })
      .join("");
    mount("projects-filter", filterButtons);

    function paint(model) {
      var rows = (projects.rows || []).filter(function (row) {
        return model === "all" || row.model === model;
      });
      if (!rows.length) {
        mount("projects-table", '<p class="table-empty">没有符合条件的项目。</p>');
        return;
      }
      var groups = [];
      rows.forEach(function (row) {
        var group = groups.filter(function (g) {
          return g.customer === row.customer;
        })[0];
        if (!group) {
          group = { customer: row.customer, items: [] };
          groups.push(group);
        }
        group.items.push(row);
      });
      var body = groups
        .map(function (group) {
          return group.items
            .map(function (row, index) {
              return (
                "<tr>" +
                (index === 0
                  ? '<td rowspan="' +
                    group.items.length +
                    '" style="font-weight:600">' +
                    esc(group.customer) +
                    "</td>"
                  : "") +
                "<td>" +
                esc(row.date) +
                "</td><td>" +
                esc(row.model) +
                '</td><td class="num">' +
                esc(row.qty) +
                "</td></tr>"
              );
            })
            .join("");
        })
        .join("");
      var total = rows.reduce(function (sum, row) {
        return sum + (Number(row.qty) || 0);
      }, 0);
      mount(
        "projects-table",
        '<div class="table-summary"><span>共 <strong>' +
          rows.length +
          "</strong> 条交付记录，覆盖 <strong>" +
          groups.length +
          "</strong> 家客户</span><span>合计交付 <strong>" +
          total +
          "</strong> 台</span></div>" +
          '<div class="table-scroll"><table class="data"><thead><tr>' +
          (projects.columns || ["客户名称", "签约时间", "设备型号", "数量"])
            .map(function (c, index) {
              return (
                "<th" +
                (index === 3 ? ' style="text-align:right"' : "") +
                ">" +
                esc(c) +
                "</th>"
              );
            })
            .join("") +
          "</tr></thead><tbody>" +
          body +
          '</tbody><tfoot><tr><td colspan="3">合计</td><td class="num">' +
          total +
          " 台</td></tr></tfoot></table></div>"
      );
    }

    paint("all");
    $$("#projects-filter .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        $$("#projects-filter .chip").forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        paint(chip.getAttribute("data-model"));
      });
    });
    return data;
  }

  /* ---------------- 资质荣誉 ---------------- */

  function renderHonors(data) {
    mount(
      "honors-slot",
      (data.groups || [])
        .map(function (group) {
          return (
            '<section class="honor-group reveal"><div class="section-head"><h2 class="h2">' +
            esc(group.title) +
            '</h2><p class="lead">' +
            esc(group.desc || "") +
            '</p></div><div class="honor-grid">' +
            (group.items || [])
              .map(function (item) {
                return (
                  '<button class="honor-card" type="button" data-lightbox="' +
                  esc(item.image) +
                  '" data-caption="' +
                  esc(item.title + (item.caption ? "　" + item.caption : "")) +
                  '"><span class="honor-card__media"><img src="' +
                  esc(item.image) +
                  '" alt="' +
                  esc(item.title) +
                  '" loading="lazy"></span><span class="honor-card__body"><span class="honor-card__title">' +
                  esc(item.title) +
                  "</span>" +
                  (item.caption
                    ? '<span class="honor-card__caption">' + esc(item.caption) + "</span>"
                    : "") +
                  "</span></button>"
                );
              })
              .join("") +
            "</div></section>"
          );
        })
        .join("") +
        (data.reviewNote
          ? '<p class="note" style="margin-top:34px">' + esc(data.reviewNote) + "</p>"
          : "")
    );

    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="关闭">×</button>' +
      "<figure><img alt=\"\"><figcaption></figcaption></figure>";
    document.body.appendChild(box);

    function close() {
      box.classList.remove("is-open");
      document.documentElement.style.overflow = "";
      $(".lightbox__close", box).blur();
    }

    box.addEventListener("click", function (event) {
      if (event.target === box || event.target.classList.contains("lightbox__close")) close();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && box.classList.contains("is-open")) close();
    });

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest ? event.target.closest("[data-lightbox]") : null;
      if (!trigger) return;
      $("img", box).src = trigger.getAttribute("data-lightbox");
      $("img", box).alt = trigger.getAttribute("data-caption") || "";
      $("figcaption", box).textContent = trigger.getAttribute("data-caption") || "";
      box.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
      $(".lightbox__close", box).focus();
    });
  }

  /* ---------------- 联系我们 ---------------- */

  function renderContact(contact) {
    var primary = contact.primary || {};
    mount(
      "contact-slot",
      '<article class="contact-card contact-card--dark reveal">' +
        '<span class="contact-card__label">' +
        esc(primary.label || "业务联系") +
        '</span><p class="contact-card__main">' +
        esc(primary.name || "") +
        '</p><ul class="contact-list"><li><a href="tel:' +
        esc(primary.mobile) +
        '">手机 ' +
        esc(primary.mobile) +
        "</a></li><li><a href=\"tel:" +
        esc(primary.phone) +
        '">总机 ' +
        esc(primary.phone) +
        '</a></li><li><a href="mailto:' +
        esc(primary.email) +
        '">' +
        esc(primary.email) +
        "</a></li></ul>" +
        '<div class="btn-row"><a class="btn btn--glass" href="tel:' +
        esc(primary.mobile) +
        '">拨打电话</a><a class="btn btn--glass-orange" href="mailto:' +
        esc(primary.email) +
        '">写邮件</a></div></article>' +
        '<article class="contact-card reveal">' +
        '<span class="contact-card__label">' +
        esc((contact.address || {}).label || "公司地址") +
        '</span><p class="contact-card__main">' +
        esc((contact.address || {}).text || "") +
        '</p><p>' +
        esc((contact.address || {}).note || "") +
        '</p><hr style="border:0;border-top:1px solid var(--line);margin:22px 0"><span class="contact-card__label">' +
        esc((contact.hours || {}).label || "工作时间") +
        '</span><p class="contact-card__main" style="font-size:1.2rem">' +
        esc((contact.hours || {}).text || "") +
        '</p><p>' +
        esc((contact.hours || {}).note || "") +
        "</p></article>"
    );

    var form = contact.form || {};
    var f = form.fields || {};
    mount(
      "form-slot",
      "<h3 class=\"h3\">" +
        esc(form.title || "在线咨询") +
        "</h3><p class=\"note\">" +
        esc(form.note || "") +
        '</p><form style="margin-top:20px" novalidate>' +
        field("name", f.name || "您的称呼", "text", true) +
        field("company", f.company || "公司名称", "text", false) +
        field("phone", f.phone || "联系电话", "tel", true) +
        '<div class="field"><label for="cf-message">' +
        esc(f.message || "需求描述") +
        '</label><textarea id="cf-message" name="message" required></textarea></div>' +
        '<button class="btn btn--primary" type="submit" style="width:100%">' +
        esc(form.submit || "发送邮件") +
        "</button></form>"
    );

    function field(name, label, type, required) {
      return (
        '<div class="field"><label for="cf-' +
        name +
        '">' +
        esc(label) +
        "</label><input id=\"cf-" +
        name +
        '" name="' +
        name +
        '" type="' +
        type +
        '"' +
        (required ? " required" : "") +
        "></div>"
      );
    }

    var node = $("#form-slot form");
    if (!node) return;
    node.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(node);
      var mail = primary.email || FALLBACK_MAIL;
      var subject = "网站咨询 - " + (data.get("name") || "未填写称呼");
      var body =
        "称呼：" +
        (data.get("name") || "") +
        "\n公司：" +
        (data.get("company") || "") +
        "\n电话：" +
        (data.get("phone") || "") +
        "\n\n需求：\n" +
        (data.get("message") || "");
      window.location.href =
        "mailto:" + mail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });

    mount(
      "aftersale-slot",
      '<h3 class="h3">' +
        esc((contact.afterSale || {}).title || "售后服务承诺") +
        '</h3><ul class="check-list" style="margin-top:18px">' +
        ((contact.afterSale || {}).items || [])
          .map(function (item) {
            return "<li>" + esc(item) + "</li>";
          })
          .join("") +
        "</ul>"
    );
  }

  /* ---------------- 滚动动效 ---------------- */

  function initReveal() {
    var nodes = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (!entry.isIntersecting) return;
          entry.target.style.setProperty("--reveal-delay", Math.min(index * 60, 240) + "ms");
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    nodes.forEach(function (n) {
      observer.observe(n);
    });
  }

  function initHeader() {
    var header = $(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- 启动 ---------------- */

  function boot() {
    var page = document.body.getAttribute("data-page");
    Promise.all([load("site"), load("contact")])
      .then(function (result) {
        var site = result[0];
        var contact = result[1];
        window.__contact = contact;
        renderHeader(site);
        renderFooter(site, contact);
        initHeader();
        document.title = document.title || site.seoTitle;

        var jobs = [];
        if (page === "home") {
          jobs.push(
            Promise.all([load("about"), load("products")]).then(function (r) {
              renderHome(site, r[0], r[1], contact);
            })
          );
        } else if (page === "about") {
          jobs.push(load("about").then(renderAbout));
        } else if (page === "products") {
          jobs.push(
            load("products").then(function (items) {
              renderProducts(items);
              wireGalleries();
            })
          );
        } else if (page === "cases") {
          jobs.push(
            load("cases").then(function (data) {
              renderCases(data);
              if (window.WochangMap) window.WochangMap.init(data);
            })
          );
        } else if (page === "honors") {
          jobs.push(load("honors").then(renderHonors));
        } else if (page === "contact") {
          renderContact(contact);
        }
        return Promise.all(jobs);
      })
      .then(function () {
        initReveal();
        fixMailLinks(window.__contact);
      })
      .catch(function (err) {
        if (window.console) console.warn("[wochang]", err);
        initReveal();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
