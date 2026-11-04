/* SVS Alsace Immobilier — front-end application */
(function () {
  'use strict';

  var D = window.SVS_DATA || {};
  var S = D.site || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var BODY_PAGE = document.body.getAttribute('data-page') || '';

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function stripTags(value) {
    var tmp = document.createElement('div');
    tmp.innerHTML = value || '';
    return (tmp.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function fmtArea(value) {
    if (!value) return '';
    return String(value).replace('.', ',') + ' m²';
  }
  function fmtPrice(value) {
    if (!value) return '';
    var n = Number(value);
    if (!isFinite(n)) return String(value);
    return n.toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' €';
  }
  function param(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }
  function plural(n, one, many) { return n + ' ' + (n > 1 ? many : one); }
  function typeLabel(it) {
    var t = (it.propType || '').toLowerCase();
    if (t.indexOf('appartement') > -1) return 'Appartement';
    if (t.indexOf('maison') > -1) return 'Maison';
    if (t.indexOf('immeuble') > -1) return 'Immeuble';
    if (t.indexOf('terrain') > -1) return 'Terrain';
    if (t.indexOf('fonds') > -1) return 'Fonds de commerce';
    if (t.indexOf('duplex') > -1) return 'Duplex';
    return it.propType || 'Bien';
  }
  function groupLabel(group) {
    return ({ vente: 'Ventes', location: 'Locations', pro: 'Biens professionnels', vendu: 'Biens vendus', loue: 'Biens loués' })[group] || 'Biens';
  }

  /* ---------- Icons ---------- */
  var ICONS = {
    'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    'pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    'bed': '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M2 16h20"/><path d="M6 10V6h6v4"/>',
    'bath': '<path d="M4 12h16"/><path d="M6 12V5a2 2 0 0 1 4 0"/><path d="M5 12v5a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-5"/><path d="M8 20v2M16 20v2"/>',
    'area': '<path d="M3 9V3h6"/><path d="M21 15v6h-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',
    'rooms': '<path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/>',
    'heart': '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>',
    'check': '<path d="m20 6-11 11-5-5"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'zoom': '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6M11 8v6"/>',
    'sliders': '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>',
    'external': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'close': '<path d="M18 6 6 18M6 6l12 12"/>',
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'building': '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>',
    'key': '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m11 12 9-9"/><path d="m17 4 3 3"/><path d="m14 7 3 3"/>',
    'document': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    'handshake': '<path d="m11 17 2 2a1 1 0 0 0 1.4 0l3.6-3.6a1 1 0 0 0 0-1.4L14 10l-2.5 2.5a1 1 0 0 1-1.4 0L8 10.3"/><path d="m8 10 2-2 4 4"/><path d="M3 8 7 4l5 4 5-4 4 4"/><path d="m21 8-4 4"/>',
    'home': '<path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M9 21v-6h6v6"/>',
    'graph': '<path d="M3 3v18h18"/><path d="m7 13 4-4 3 3 5-6"/>',
    'spark': '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
    'wallet': '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M16 14h2"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    'instagram': '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    'x': '<path d="M4 4l16 16M20 4 4 20"/>',
    'quote': '<path d="M10 11H6a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3h1"/><path d="M20 11h-4a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3h1"/><path d="M8 11v4a4 4 0 0 1-4 4M18 11v4a4 4 0 0 1-4 4"/>'
  };
  function icon(name, size, cls) {
    size = size || 18;
    return '<svg class="' + (cls || '') + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  function socialIcon(name) {
    var key = name.toLowerCase();
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[key] || ICONS.external) + '</svg>';
  }

  /* ---------- Layout ---------- */
  function navLink(href, label, page, cls) {
    return '<a class="' + (cls || 'nav__link') + (BODY_PAGE === page ? ' is-active' : '') + '" href="' + href + '">' + label + '</a>';
  }
  function renderHeader() {
    var host = document.getElementById('site-header');
    if (!host) return;
    var socials = (S.socials || []).map(function (s) {
      return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.name) + '">' + socialIcon(s.name) + '</a>';
    }).join('');
    var agencyLinks = [
      ['equipe.html', 'Nos conseillers', 'equipe'],
      ['recommandations.html', 'Recommandation', 'recommandations'],
      ['recrutement.html', 'Recrutement', 'recrutement'],
      ['alerte.html', 'Alerte e-mail', 'alerte'],
      ['actualites.html', 'Actualités', 'actualites'],
      ['liens.html', 'Nos partenaires', 'liens']
    ];
    host.innerHTML =
      '<div class="topbar"><div class="container topbar__inner">' +
        '<div class="topbar__group"><a class="topbar__phone" href="tel:' + esc(S.phoneHref) + '">' + icon('phone', 12) + esc(S.phone) + '</a>' +
        '<span>' + esc(S.address) + ', ' + esc(S.postal) + ' ' + esc(S.city) + '</span></div>' +
        '<div class="topbar__group"><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a><div class="topbar__socials">' + socials + '</div></div>' +
      '</div></div>' +
      '<nav class="nav" aria-label="Navigation principale"><div class="container nav__inner">' +
        '<a class="brand" href="index.html" aria-label="SVS Alsace Immobilier, accueil">' +
          '<span class="brand__mark">SVS</span>' +
          '<span class="brand__text"><span class="brand__name">SVS Alsace</span><span class="brand__sub">Immobilier · Châtenois</span></span>' +
        '</a>' +
        '<div class="nav__links">' +
          navLink('acheter.html', 'Ventes', 'acheter') +
          navLink('location.html', 'Locations', 'location') +
          navLink('professionnels.html', 'Biens pro', 'professionnels') +
          navLink('vendus.html', 'Vendus', 'vendus') +
          navLink('loues.html', 'Loués', 'loues') +
          '<div class="nav__item nav__item--has-menu">' +
            '<button class="nav__link" type="button" aria-haspopup="true">L\'agence ' + icon('chevron-down', 12) + '</button>' +
            '<div class="nav__dropdown">' + agencyLinks.map(function (l) { return '<a href="' + l[0] + '">' + l[1] + '<span>→</span></a>'; }).join('') + '</div>' +
          '</div>' +
          navLink('contact.html', 'Contact', 'contact') +
        '</div>' +
        '<div class="nav__actions">' +
          '<a class="btn btn--primary btn--sm" href="estimation.html">Estimer mon bien</a>' +
          '<button class="menu-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</div></nav>';
    var mobile = document.getElementById('mobileMenu');
    if (mobile) {
      mobile.innerHTML =
        '<div class="container">' +
          '<div class="mobile-menu__links">' +
            [['acheter.html', 'Ventes'], ['location.html', 'Locations'], ['professionnels.html', 'Biens pro'], ['vendus.html', 'Biens vendus'], ['loues.html', 'Biens loués'], ['estimation.html', 'Estimation'], ['contact.html', 'Contact']].map(function (l) { return '<a href="' + l[0] + '">' + l[1] + '<span>→</span></a>'; }).join('') +
          '</div>' +
          '<div class="mobile-menu__sub">' + agencyLinks.map(function (l) { return '<a href="' + l[0] + '">' + l[1] + '</a>'; }).join('') + '</div>' +
          '<div class="mobile-menu__foot">' +
            '<a class="btn btn--primary btn--block" href="estimation.html">Estimer mon bien</a>' +
            '<a class="btn btn--ghost btn--block" href="tel:' + esc(S.phoneHref) + '">' + icon('phone', 15) + esc(S.phone) + '</a>' +
          '</div>' +
        '</div>';
    }
  }

  function renderFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;
    var socials = (S.socials || []).map(function (s) {
      return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.name) + '">' + socialIcon(s.name) + '</a>';
    }).join('');
    host.innerHTML =
      '<footer class="site-footer"><div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="brand" href="index.html"><span class="brand__mark">SVS</span><span class="brand__text"><span class="brand__name">SVS Alsace Immobilier</span><span class="brand__sub">Châtenois · Alsace · Lorraine</span></span></a>' +
            '<p>Agence immobilière indépendante spécialisée dans la vente, l\'achat, la location et l\'estimation de biens immobiliers en Alsace et en Lorraine.</p>' +
            '<div class="footer-values"><span>Sincérité</span><span>Valeurs</span><span>Sécurité</span></div>' +
            '<div class="footer-logo"><img src="assets/images/logo.png" alt="Logo SVS Alsace Immobilier" loading="lazy"><span style="font-size:.66rem;color:rgba(246,241,231,.5)">Agence membre du réseau Interkab</span></div>' +
            '<div class="socials">' + socials + '</div>' +
          '</div>' +
          '<div class="footer-col"><h3>Explorer</h3><ul>' +
            '<li><a href="acheter.html">Biens à vendre</a></li><li><a href="location.html">Biens à louer</a></li><li><a href="professionnels.html">Biens professionnels</a></li><li><a href="vendus.html">Biens vendus</a></li><li><a href="loues.html">Biens loués</a></li><li><a href="estimation.html">Estimation gratuite</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h3>L\'agence</h3><ul>' +
            '<li><a href="equipe.html">Nos conseillers</a></li><li><a href="recommandations.html">Recommandation</a></li><li><a href="recrutement.html">Recrutement</a></li><li><a href="actualites.html">Actualités</a></li><li><a href="liens.html">Nos partenaires</a></li><li><a href="contact.html">Contact</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h3>Informations</h3><ul>' +
            '<li><a href="honoraires.html">Nos honoraires</a></li><li><a href="mentions-legales.html">Mentions légales</a></li><li><a href="confidentialite.html">Politique RGPD</a></li><li><a href="confidentialite.html#cookies">Cookies</a></li><li><a href="plan-du-site.html">Plan du site</a></li><li><a href="https://www.svsalsaceimmobilier.fr/admin/espace_client.php" target="_blank" rel="noopener">Espace propriétaire</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom"><span>© 2026 SVS Alsace Immobilier · Tous droits réservés</span><div class="footer-bottom__links"><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">RGPD</a><a href="honoraires.html">Honoraires</a><span>Agence membre Interkab</span></div></div>' +
      '</div></footer>';
  }

  function initHeader() {
    var header = $('.site-header');
    var toggle = $('.menu-toggle');
    var mobile = document.getElementById('mobileMenu');
    function onScroll() {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 18);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toggle && mobile) {
      toggle.addEventListener('click', function () {
        var open = !mobile.classList.contains('is-open');
        mobile.classList.toggle('is-open', open);
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        document.body.style.overflow = open ? 'hidden' : '';
      });
      $$('a', mobile).forEach(function (a) {
        a.addEventListener('click', function () {
          mobile.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobile.classList.contains('is-open')) {
          mobile.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  }

  /* ---------- Reveal ---------- */
  var revealObserver = null;
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    }
    $$('.reveal:not(.is-in)').forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Cards ---------- */
  function badgeClass(label) {
    var l = label.toLowerCase();
    if (l.indexOf('exclus') > -1) return 'badge--exclu';
    if (l.indexOf('coeur') > -1 || l.indexOf('cœur') > -1) return 'badge--heart';
    if (l.indexOf('nouveau') > -1) return 'badge--new';
    if (l.indexOf('baisse') > -1) return 'badge--price';
    return '';
  }
  function propertyCard(it) {
    var archive = it.group === 'vendu' || it.group === 'loue';
    var badges = (it.badges || []).filter(function (b) { return b !== 'Vendu' && b !== 'Loué'; }).slice(0, 2);
    if (archive) badges.unshift(it.statusLabel);
    var badgeHtml = badges.map(function (b) {
      var cls = b === 'Vendu' || b === 'Loué' ? 'badge--sold' : badgeClass(b);
      return '<span class="badge ' + cls + '">' + esc(b) + '</span>';
    }).join('');
    var specs = [];
    if (it.rooms) specs.push('<span class="property-card__spec">' + icon('rooms', 14) + it.rooms + ' pièces</span>');
    if (it.bedrooms) specs.push('<span class="property-card__spec">' + icon('bed', 14) + it.bedrooms + ' ch.</span>');
    var terrain = (it.features || []).filter(function (f) { return /terrain/i.test(f.label); })[0];
    if (it.area) specs.push('<span class="property-card__spec">' + icon('area', 14) + fmtArea(it.area) + '</span>');
    else if (terrain) specs.push('<span class="property-card__spec">' + icon('area', 14) + esc(terrain.value) + '</span>');
    var summary = it.summary || (it.description ? stripTags(it.description).slice(0, 110) + '…' : '');
    var price = it.priceLabel || (archive ? it.statusLabel : 'Prix sur demande');
    var priceSmall = it.group === 'location' ? 'par mois · CC*' : (archive ? 'Bien ' + it.statusLabel.toLowerCase() : 'Honoraires inclus');
    return '<article class="property-card ' + (archive ? 'is-archive' : '') + ' reveal">' +
      '<a class="property-card__media" href="bien.html?id=' + encodeURIComponent(it.key) + '" aria-label="Voir ' + esc(it.title) + '">' +
        '<img src="' + esc(it.cover) + '" alt="' + esc(it.title) + ' à ' + esc(it.city) + '" loading="lazy">' +
        '<span class="property-card__badges">' + badgeHtml + '</span>' +
      '</a>' +
      '<div class="property-card__body">' +
        '<div class="property-card__loc">' + icon('pin', 13) + esc(it.city) + ' (' + esc(it.postal) + ')</div>' +
        '<h3 class="property-card__title"><a href="bien.html?id=' + encodeURIComponent(it.key) + '">' + esc(it.title) + '</a></h3>' +
        '<p class="property-card__summary">' + esc(summary) + '</p>' +
        '<div class="property-card__specs">' + specs.join('') + '</div>' +
        '<div class="property-card__foot">' +
          '<div><div class="property-card__price">' + esc(price) + '<small>' + esc(priceSmall) + '</small></div>' + (it.ref ? '<div class="property-card__ref">Réf. ' + esc(it.ref) + '</div>' : '') + '</div>' +
          '<a class="property-card__link" href="bien.html?id=' + encodeURIComponent(it.key) + '">Voir le bien ' + icon('arrow-right', 14) + '</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function ctaTile() {
    return '<article class="property-card reveal" style="background:var(--forest);color:var(--cream);justify-content:center;min-height:100%">' +
      '<div class="property-card__body" style="padding:38px">' +
        '<span class="eyebrow eyebrow--light">Toute la sélection</span>' +
        '<h3 class="property-card__title" style="color:var(--cream);font-size:2rem;margin-top:16px">Découvrez tous nos biens disponibles.</h3>' +
        '<p style="color:rgba(246,241,231,.65);font-size:.9rem;margin-top:12px">Ventes, locations et biens professionnels : trouvez celui qui vous ressemble.</p>' +
        '<a class="btn btn--light" style="margin-top:26px;align-self:flex-start" href="acheter.html">Voir les annonces ' + icon('arrow-right', 15) + '</a>' +
      '</div>' +
    '</article>';
  }

  /* ---------- Listing pages ---------- */
  function listingGroup() {
    var root = document.getElementById('listing-root');
    return root ? (root.getAttribute('data-group') || 'vente') : 'vente';
  }
  function initListingPage() {
    var root = document.getElementById('listing-root');
    if (!root) return;
    var group = root.getAttribute('data-group') || 'vente';
    var pool = (D.listings || []).filter(function (it) { return it.group === group; });
    var grid = document.getElementById('listing-grid');
    var countEl = document.getElementById('result-count');
    var typeSel = document.getElementById('filter-type');
    var citySel = document.getElementById('filter-city');
    var maxInput = document.getElementById('filter-max');
    var minArea = document.getElementById('filter-area');
    var sortSel = document.getElementById('filter-sort');
    var refInput = document.getElementById('filter-ref');
    var resetBtn = document.getElementById('filter-reset');
    if (!grid) return;

    function unique(list) {
      return Array.from(new Set(list.filter(Boolean))).sort(function (a, b) { return a.localeCompare(b, 'fr'); });
    }
    if (typeSel) {
      unique(pool.map(typeLabel)).forEach(function (t) {
        typeSel.insertAdjacentHTML('beforeend', '<option value="' + esc(t) + '">' + esc(t) + '</option>');
      });
    }
    if (citySel) {
      unique(pool.map(function (it) { return it.city + ' (' + it.postal + ')'; })).forEach(function (c) {
        citySel.insertAdjacentHTML('beforeend', '<option value="' + esc(c) + '">' + esc(c) + '</option>');
      });
    }
    // Prefill from URL
    var qType = param('type');
    var qCity = param('city');
    var qMax = param('max');
    if (qType && typeSel) {
      $$('option', typeSel).forEach(function (o) { if (o.value.toLowerCase() === qType.toLowerCase()) typeSel.value = o.value; });
    }
    if (qCity && citySel) {
      var cityMatch = $$('option', citySel).filter(function (o) { return o.value.toLowerCase().indexOf(qCity.toLowerCase()) > -1; })[0];
      if (cityMatch) citySel.value = cityMatch.value;
    }
    if (qMax && maxInput) maxInput.value = qMax;

    function current() {
      var type = typeSel ? typeSel.value : '';
      var city = citySel ? citySel.value : '';
      var max = maxInput ? Number(maxInput.value) : 0;
      var area = minArea ? Number(minArea.value) : 0;
      var ref = refInput ? refInput.value.trim().toLowerCase() : '';
      var out = pool.filter(function (it) {
        if (type && typeLabel(it) !== type) return false;
        if (city && it.city + ' (' + it.postal + ')' !== city) return false;
        if (max && (!it.priceNum || it.priceNum > max)) return false;
        if (area && (!it.area || it.area < area)) return false;
        if (ref && (String(it.ref || '') + ' ' + String(it.key || '')).toLowerCase().indexOf(ref) === -1) return false;
        return true;
      });
      var sort = sortSel ? sortSel.value : 'default';
      if (sort === 'price-asc') out.sort(function (a, b) { return (a.priceNum || 1e12) - (b.priceNum || 1e12); });
      if (sort === 'price-desc') out.sort(function (a, b) { return (b.priceNum || 0) - (a.priceNum || 0); });
      if (sort === 'area-desc') out.sort(function (a, b) { return (b.area || 0) - (a.area || 0); });
      return out;
    }
    function render() {
      var list = current();
      grid.innerHTML = list.length ? list.map(propertyCard).join('') : '<div class="empty-state"><h3>Aucun bien ne correspond à ces critères.</h3><p>Élargissez votre recherche ou créez une alerte e-mail pour être prévenu dès qu\'un bien correspond.</p><div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn--primary" href="alerte.html">Créer une alerte</a><a class="btn btn--ghost" href="contact.html">Nous contacter</a></div></div>';
      if (countEl) countEl.textContent = list.length;
      initReveal();
    }
    [typeSel, citySel, maxInput, minArea, sortSel, refInput].forEach(function (el) {
      if (el) el.addEventListener('input', render);
      if (el) el.addEventListener('change', render);
    });
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (typeSel) typeSel.value = '';
        if (citySel) citySel.value = '';
        if (maxInput) maxInput.value = '';
        if (minArea) minArea.value = '';
        if (sortSel) sortSel.value = 'default';
        if (refInput) refInput.value = '';
        render();
      });
    }
    render();
  }

  /* ---------- Home ---------- */
  function initHome() {
    var featured = document.getElementById('featured-grid');
    if (featured) {
      var picks = (D.listings || []).filter(function (it) { return it.featured; }).slice(0, 5);
      featured.innerHTML = picks.map(propertyCard).join('') + ctaTile();
      initReveal();
    }
    var teamGrid = document.getElementById('home-team');
    if (teamGrid) {
      teamGrid.innerHTML = (D.team || []).map(function (m) {
        return '<article class="team-card reveal">' +
          '<div class="team-card__photo"><img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy"></div>' +
          '<div class="team-card__body"><span class="team-card__role">' + esc(m.role) + '</span><h3>' + esc(m.name) + '</h3>' +
          '<p class="team-card__quote">Une écoute attentive, une connaissance fine du terrain et un accompagnement de chaque instant.</p>' +
          '<div class="team-card__contacts"><a href="tel:' + esc(m.phoneHref) + '">' + icon('phone', 15) + esc(m.phone) + '</a><a href="mailto:' + esc(m.email) + '">' + icon('mail', 15) + esc(m.email) + '</a></div></div>' +
        '</article>';
      }).join('');
      initReveal();
    }
    var trio = document.getElementById('home-trio');
    if (trio) {
      var latest = (D.news || [])[0];
      trio.innerHTML =
        '<article class="trio-card reveal"><div class="trio-card__media"><img src="' + esc(latest.image) + '" alt="Actualités SVS Alsace Immobilier" loading="lazy"></div><div class="trio-card__body"><span class="trio-card__tag">Nos actualités · ' + esc(latest.date) + '</span><h3>' + esc(latest.title) + '</h3><p>' + esc(latest.excerpt) + '</p><a class="link-arrow" href="actualites.html">Lire les actualités ' + icon('arrow-right', 14) + '</a></div></article>' +
        '<article class="trio-card reveal reveal-delay-1"><div class="trio-card__media" style="background:var(--forest);display:grid;place-items:center;min-height:200px"><span style="font-family:var(--serif);font-size:2.4rem;color:var(--gold);letter-spacing:-.04em">Interkab</span></div><div class="trio-card__body"><span class="trio-card__tag">Nos partenaires</span><h3>Un réseau de 8 000 agences</h3><p>Nos partenaires locaux et notre communauté d\'agents indépendants nous permettent de trouver plus vite le bien qui vous correspond.</p><a class="link-arrow" href="liens.html">Découvrir les partenaires ' + icon('arrow-right', 14) + '</a></div></article>' +
        '<article class="trio-card reveal reveal-delay-2"><div class="trio-card__media" style="background:var(--sand);display:grid;place-items:center;min-height:200px">' + icon('users', 56) + '</div><div class="trio-card__body"><span class="trio-card__tag">Recrutement</span><h3>Rejoignez notre équipe</h3><p>Vous souhaitez donner un nouvel élan à votre carrière ? Nous recherchons des négociateurs indépendants en Alsace et en Lorraine.</p><a class="link-arrow" href="recrutement.html">Voir l\'offre ' + icon('arrow-right', 14) + '</a></div></article>';
      initReveal();
    }
    initHomeSearch();
  }

  function initHomeSearch() {
    var form = document.getElementById('home-search');
    if (!form) return;
    var tabs = $$('.search-tab', form);
    var target = document.getElementById('search-target');
    var budget = document.getElementById('search-budget');
    var city = document.getElementById('search-city');
    var type = document.getElementById('search-type');
    var mode = 'acheter';
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        mode = tab.getAttribute('data-mode');
        target.value = mode === 'louer' ? 'location.html' : 'acheter.html';
        if (budget) {
          var label = budget.closest('.search-field').querySelector('label');
          if (label) label.textContent = mode === 'louer' ? 'Loyer max' : 'Budget max';
        }
        if (city) city.setAttribute('placeholder', 'Ville ou code postal');
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var params = new URLSearchParams();
      if (type && type.value) params.set('type', type.value);
      if (city && city.value.trim()) params.set('city', city.value.trim());
      if (budget && budget.value) params.set('max', String(budget.value).replace(/\D/g, ''));
      window.location.href = (mode === 'louer' ? 'location.html' : 'acheter.html') + (params.toString() ? '?' + params.toString() : '');
    });
  }

  /* ---------- Detail ---------- */
  function initDetail() {
    var root = document.getElementById('detail-root');
    if (!root) return;
    var id = param('id');
    var it = (D.listings || []).filter(function (x) { return x.key === id; })[0];
    if (!it) {
      root.innerHTML = '<section class="section detail-page"><div class="container"><div class="empty-state"><h3>Ce bien n\'est plus disponible.</h3><p>Il a peut-être été vendu ou retiré de la vitrine. Découvrez nos biens actuellement disponibles.</p><div style="margin-top:20px"><a class="btn btn--primary" href="acheter.html">Voir les biens à vendre</a></div></div></div></section>';
      return;
    }
    document.title = it.title + ' · ' + it.city + ' | SVS Alsace Immobilier';
    var archive = it.group === 'vendu' || it.group === 'loue';
    var photos = it.photos && it.photos.length ? it.photos : [it.cover];
    var area = it.area ? fmtArea(it.area) : '';
    var terrain = (it.features || []).filter(function (f) { return /terrain/i.test(f.label); })[0];
    if (!area && terrain) area = terrain.value;
    var specs = [];
    if (it.rooms) specs.push('<span class="detail-spec">' + icon('rooms', 16) + '<span><strong>' + it.rooms + '</strong> pièces</span></span>');
    if (it.bedrooms) specs.push('<span class="detail-spec">' + icon('bed', 16) + '<span><strong>' + it.bedrooms + '</strong> chambres</span></span>');
    if (it.bathrooms) specs.push('<span class="detail-spec">' + icon('bath', 16) + '<span><strong>' + it.bathrooms + '</strong> salle de bains</span></span>');
    if (area) specs.push('<span class="detail-spec">' + icon('area', 16) + '<span><strong>' + esc(area) + '</strong></span></span>');

    var badgeHtml = (it.badges || []).map(function (b) {
      var cls = b === 'Vendu' || b === 'Loué' ? 'badge--sold' : badgeClass(b);
      return '<span class="badge ' + cls + '">' + esc(b) + '</span>';
    }).join('');

    var price = it.priceLabel || (archive ? it.statusLabel : 'Prix sur demande');
    var priceNote = archive ? 'Ce bien est ' + it.statusLabel.toLowerCase() : (it.group === 'location' ? 'Par mois, charges comprises*' : 'Honoraires inclus · hors frais de notaire');
    var agent = (D.team || [])[1] || { name: 'Vincent SATTLER', role: 'Agent immobilier diplômé · gérant', phone: S.phone, phoneHref: S.phoneHref, email: S.email, photo: 'assets/images/team/vincent.webp' };

    var thumbHtml = photos.slice(0, 5).map(function (p, i) {
      return '<button class="detail-gallery__thumb ' + (i === 0 ? 'is-active' : '') + '" type="button" data-index="' + i + '" aria-label="Afficher la photo ' + (i + 1) + '"><img src="' + esc(p) + '" alt="" loading="lazy"></button>';
    }).join('');

    var featuresHtml = (it.features || []).map(function (f) {
      return '<div class="feature-item"><span>' + esc(f.label) + '</span><strong>' + esc(f.value) + '</strong></div>';
    }).join('');

    var addressQuery = encodeURIComponent([it.city, it.postal].filter(Boolean).join(' '));
    var similar = (D.listings || []).filter(function (x) { return x.group === it.group && x.key !== it.key; }).slice(0, 3);

    root.innerHTML =
      '<div class="container"><div class="detail-page">' +
        '<nav class="breadcrumbs" aria-label="Fil d\'Ariane"><a href="index.html">Accueil</a><span>/</span><a href="' + (it.group === 'location' ? 'location.html' : it.group === 'loue' ? 'loues.html' : it.group === 'vendu' ? 'vendus.html' : it.group === 'pro' ? 'professionnels.html' : 'acheter.html') + '">' + esc(groupLabel(it.group)) + '</a><span>/</span><span>' + esc(it.city) + '</span></nav>' +
        '<div class="detail-top">' +
          '<div>' +
            '<div class="detail-gallery">' +
              '<div class="detail-gallery__main" id="gallery-main" role="button" tabindex="0" aria-label="Agrandir la photo">' +
                '<img src="' + esc(photos[0]) + '" alt="' + esc(it.title) + ' — photo 1">' +
              '</div>' +
              '<div class="detail-gallery__thumbs">' + thumbHtml + '</div>' +
            '</div>' +
            '<div class="detail-head"><div class="detail-head__loc">' + icon('pin', 14) + '<span>' + esc(it.city) + ' (' + esc(it.postal) + ')</span><span class="dot"></span><span>' + esc(typeLabel(it)) + '</span>' + (it.ref ? '<span class="dot"></span><span>Réf. ' + esc(it.ref) + '</span>' : '') + '</div>' +
              '<h1>' + esc(it.title) + '</h1>' +
              (it.summary ? '<p class="lede" style="margin-top:14px">' + esc(it.summary) + '</p>' : '') +
            '</div>' +
            '<div class="detail-content">' +
              '<section class="detail-section"><h2>Découvrir le bien</h2><div class="prose">' + (it.desc || '<p>' + esc(stripTags(it.description || '')) + '</p>') + '</div></section>' +
              (featuresHtml ? '<section class="detail-section"><h2>Caractéristiques</h2><p class="detail-section__sub">Les informations essentielles communiquées par l\'agence.</p><div class="feature-grid">' + featuresHtml + '</div></section>' : '') +
              '<section class="detail-section"><h2>Localisation</h2><div class="location-box"><div class="location-box__address">' + icon('pin', 20) + '<div><strong>' + esc(it.city) + (it.postal ? ' (' + esc(it.postal) + ')' : '') + '</strong><span>Alsace · Grand Est</span></div></div><a class="btn btn--ghost btn--sm" href="https://www.google.com/maps/search/?api=1&query=' + addressQuery + '" target="_blank" rel="noopener">Voir sur la carte ' + icon('arrow-up-right', 14) + '</a></div>' +
                '<p class="detail-section__sub" style="margin-top:14px">Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques et à l\'agence sur simple demande.</p></section>' +
              '<section class="detail-section" id="contact-bien"><div class="detail-contact-form"><span class="eyebrow">Une question ?</span><h2>Contactez-nous pour ce bien</h2><p>Référence ' + esc(it.ref || it.key) + ' · ' + esc(it.city) + '. Nous vous répondons sous 24 h ouvrées.</p>' +
                '<form class="mailto-form" data-subject="Demande d\'information — ' + esc(it.title) + ' (' + esc(it.ref || it.key) + ')" data-context="Bien : ' + esc(it.title) + ' — Réf. ' + esc(it.ref || it.key) + '">' +
                  '<div class="form-grid"><div class="form-field"><label for="d-nom">Nom *</label><input id="d-nom" name="Nom" required autocomplete="name"></div><div class="form-field"><label for="d-prenom">Prénom *</label><input id="d-prenom" name="Prénom" required autocomplete="given-name"></div><div class="form-field"><label for="d-email">E-mail *</label><input id="d-email" name="E-mail" type="email" required autocomplete="email"></div><div class="form-field"><label for="d-tel">Téléphone *</label><input id="d-tel" name="Téléphone" type="tel" required autocomplete="tel"></div><div class="form-field form-field--full"><label for="d-message">Message *</label><textarea id="d-message" name="Message" required>Bonjour, je souhaite recevoir plus d\'informations sur ce bien.</textarea></div></div>' +
                  '<label class="form-consent"><input type="checkbox" required> J\'ai pris connaissance de la <a href="confidentialite.html">politique de confidentialité</a> et j\'accepte d\'être contacté(e) au sujet de ma demande. *</label>' +
                  '<div class="form-actions"><button class="btn btn--primary" type="submit">Envoyer ma demande ' + icon('arrow-right', 15) + '</button><span class="form-note">* Champs obligatoires</span></div>' +
                  '<div class="form-status" role="status"></div>' +
                '</form>' +
              '</div></section>' +
            '</div>' +
          '</div>' +
          '<aside class="detail-aside">' +
            '<div class="detail-card"><span class="detail-card__label">' + esc(it.statusLabel) + '</span><div class="detail-price">' + esc(price) + '<small>' + esc(priceNote) + '</small></div>' +
              (it.ref ? '<div class="detail-ref">Référence : ' + esc(it.ref) + '</div>' : '') +
              '<div class="detail-badges">' + badgeHtml + '</div>' +
              '<div class="detail-specs">' + specs.join('') + '</div>' +
              '<div class="detail-card__actions">' +
                (archive ? '<a class="btn btn--primary btn--block" href="' + (it.group === 'vendu' ? 'acheter.html' : 'location.html') + '">Voir les biens disponibles</a>' : '<a class="btn btn--primary btn--block" href="tel:' + esc(agent.phoneHref) + '">' + icon('phone', 15) + 'Appeler l\'agence</a><a class="btn btn--ghost btn--block" href="#contact-bien">Demander une visite</a>') +
                (it.virtualTour ? '<a class="btn btn--ghost btn--block" href="' + esc(it.virtualTour) + '" target="_blank" rel="noopener">' + icon('zoom', 15) + 'Visite 360°</a>' : '') +
              '</div>' +
              '<div class="detail-agent"><img src="' + esc(agent.photo) + '" alt="' + esc(agent.name) + '"><div><small>Votre conseiller</small><strong>' + esc(agent.name) + '</strong><span style="display:block;font-size:.7rem;color:var(--ink-soft)">' + esc(agent.phone) + '</span></div></div>' +
            '</div>' +
            '<div class="detail-card detail-contact"><span class="detail-card__label">Agence de Châtenois</span><h3>Un projet immobilier ?</h3><p>Estimation gratuite, conseil personnalisé et accompagnement jusqu\'à la signature.</p><a class="btn btn--light btn--block" href="estimation.html">Estimer mon bien ' + icon('arrow-right', 15) + '</a><a class="link-arrow link-arrow--light" style="margin-top:16px" href="tel:' + esc(S.phoneHref) + '">' + esc(S.phone) + '</a></div>' +
          '</aside>' +
        '</div>' +
        (similar.length ? '<section class="similar"><div class="section-head"><div class="section-head__copy"><span class="eyebrow">À découvrir aussi</span><h2 class="display-md">Biens similaires</h2></div><a class="link-arrow" href="' + (it.group === 'vendu' ? 'vendus.html' : it.group === 'loue' ? 'loues.html' : 'acheter.html') + '">Tout voir ' + icon('arrow-right', 14) + '</a></div><div class="property-grid">' + similar.map(propertyCard).join('') + '</div></section>' : '') +
      '</div></div>';
    initReveal();
    initDetailGallery(photos, it);
    initForms();
  }

  function initDetailGallery(photos, it) {
    var main = document.getElementById('gallery-main');
    var thumbs = $$('.detail-gallery__thumb');
    var index = 0;
    function show(i) {
      index = (i + photos.length) % photos.length;
      var img = $('img', main);
      if (img) { img.src = photos[index]; img.alt = it.title + ' — photo ' + (index + 1); }
      thumbs.forEach(function (t, ti) { t.classList.toggle('is-active', ti === index); });
    }
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () { show(Number(t.getAttribute('data-index'))); });
    });
    if (main) {
      main.addEventListener('click', function () { openLightbox(photos, index); });
      main.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(photos, index); } });
    }
    initLightbox(photos);
  }

  var lightboxPhotos = [], lightboxIndex = 0;
  function initLightbox(photos) {
    lightboxPhotos = photos;
    var box = document.getElementById('lightbox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'lightbox';
      box.className = 'lightbox';
      box.innerHTML = '<button class="lightbox__close" aria-label="Fermer">' + icon('close', 20) + '</button><button class="lightbox__prev" aria-label="Photo précédente">' + icon('chevron-left', 22) + '</button><img alt=""><button class="lightbox__next" aria-label="Photo suivante">' + icon('chevron-right', 22) + '</button><span class="lightbox__count"></span>';
      document.body.appendChild(box);
      $('.lightbox__close', box).addEventListener('click', closeLightbox);
      $('.lightbox__prev', box).addEventListener('click', function () { moveLightbox(-1); });
      $('.lightbox__next', box).addEventListener('click', function () { moveLightbox(1); });
      box.addEventListener('click', function (e) { if (e.target === box) closeLightbox(); });
      document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') moveLightbox(-1);
        if (e.key === 'ArrowRight') moveLightbox(1);
      });
    }
  }
  function updateLightbox() {
    var box = document.getElementById('lightbox');
    if (!box) return;
    $('img', box).src = lightboxPhotos[lightboxIndex];
    $('img', box).alt = 'Photo ' + (lightboxIndex + 1) + ' sur ' + lightboxPhotos.length;
    $('.lightbox__count', box).textContent = (lightboxIndex + 1) + ' / ' + lightboxPhotos.length;
  }
  function openLightbox(photos, index) {
    lightboxPhotos = photos;
    lightboxIndex = index || 0;
    updateLightbox();
    var box = document.getElementById('lightbox');
    if (box) { box.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  }
  function closeLightbox() {
    var box = document.getElementById('lightbox');
    if (box) { box.classList.remove('is-open'); document.body.style.overflow = ''; }
  }
  function moveLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxPhotos.length) % lightboxPhotos.length;
    updateLightbox();
  }

  /* ---------- Forms ---------- */
  function initForms() {
    $$('form.mailto-form').forEach(function (form) {
      if (form.dataset.bound) return;
      form.dataset.bound = '1';
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var status = $('.form-status', form);
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var subject = form.getAttribute('data-subject') || 'Message depuis le site SVS Alsace Immobilier';
        var context = form.getAttribute('data-context') || '';
        var lines = [];
        if (context) lines.push(context, '');
        new FormData(form).forEach(function (value, key) {
          if (value instanceof File) return;
          lines.push(key + ' : ' + value);
        });
        var body = lines.join('\n');
        var href = 'mailto:' + S.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        if (status) {
          status.classList.add('is-visible');
          status.classList.remove('is-error');
          status.innerHTML = 'Votre messagerie va s\'ouvrir avec votre demande pré-remplie. Si rien ne se passe, écrivez-nous directement à <a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a>.' + (form.querySelector('input[type=file]') ? ' Pensez à joindre votre CV dans le mail.' : '');
        }
        window.location.href = href;
      });
    });
  }

  /* ---------- Init ---------- */
  function init() {
    renderHeader();
    renderFooter();
    initHeader();
    initHome();
    initListingPage();
    initDetail();
    initForms();
    initReveal();
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
