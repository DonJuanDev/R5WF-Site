/**
 * R5WF Películas Especiais · script.js
 *
 * Módulos:
 *  1. NAV           · scroll behavior (transparente → branco) e ocultação
 *  2. MOBILE MENU   · toggle hambúrguer com acessibilidade
 *  3. ANIMATIONS    · Intersection Observer (fade-in / slide-up / slide-left)
 *  4. PARALLAX      · hero image subtil via requestAnimationFrame
 *  5. COMPARISON    · Before/After slider (mouse + touch + teclado)
 *  6. COUNTERS      · Animação de contagem com easing ao entrar na viewport
 *  7. FAQ           · Accordion acessível com ARIA
 *  8. SMOOTH SCROLL · Links internos com offset do nav fixo
 *  9. FOOTER YEAR   · Atualiza o ano automaticamente
 */

(function () {
  'use strict';

  /* ============================================================
     UTIL · verifica se prefers-reduced-motion está ativo
     ============================================================ */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  /* ============================================================
     1. NAV · Scroll behavior
     Adiciona classe .is-scrolled quando passa de 40px de scroll
     ============================================================ */
  const nav = document.getElementById('nav');

  function onNavScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  let navScrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!navScrollTicking) {
      requestAnimationFrame(function () {
        onNavScroll();
        navScrollTicking = false;
      });
      navScrollTicking = true;
    }
  }, { passive: true });

  // Executa uma vez ao carregar (pode já estar no meio da página)
  onNavScroll();


  /* ============================================================
     2. MOBILE MENU · Toggle com hambúrguer e gestão de foco
     ============================================================ */
  const navToggle = document.querySelector('.nav__toggle');
  const navMobile = document.getElementById('nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link, .nav__mobile .btn');

  function openMenu() {
    navToggle.classList.add('is-open');
    navMobile.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('is-open');
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Fecha ao clicar em qualquer link do menu
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fecha ao pressionar Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Fecha ao clicar fora do nav
    document.addEventListener('click', function (e) {
      if (
        navMobile.classList.contains('is-open') &&
        !navMobile.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }


  /* ============================================================
     3. ANIMATIONS · Intersection Observer
     Observa todos os [data-animate] e aplica .is-visible
     Suporta data-delay para stagger (em ms)
     ============================================================ */
  var animObserver = null;

  function observeAnimatedElements(root) {
    var scope = root || document;
    var animatedEls = scope.querySelectorAll('[data-animate]:not(.is-visible)');

    if (!animatedEls.length) return;

    if (prefersReducedMotion) {
      animatedEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    if (!animObserver) {
      animObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            var el    = entry.target;
            var delay = parseInt(el.dataset.delay || '0', 10);

            setTimeout(function () {
              el.classList.add('is-visible');
            }, delay);

            animObserver.unobserve(el);
          });
        },
        { rootMargin: '0px 0px -60px 0px', threshold: 0.12 }
      );
    }

    animatedEls.forEach(function (el) { animObserver.observe(el); });
  }

  observeAnimatedElements();


  /* ============================================================
     4. PARALLAX · Hero image deslocamento sutil no scroll
     Apenas em desktops e sem prefers-reduced-motion
     ============================================================ */
  var heroBg  = document.getElementById('hero-bg');
  var heroImg = heroBg ? heroBg.querySelector('.hero__img') : null;

  if (heroImg && !prefersReducedMotion && window.innerWidth > 768) {
    var parallaxTicking = false;

    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(function () {
          var scrollY   = window.scrollY;
          var maxScroll = window.innerHeight;
          if (scrollY <= maxScroll) {
            // translateY positivo: imagem sobe mais devagar que a página
            heroImg.style.transform = 'translateY(' + (scrollY * 0.22) + 'px)';
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }


  /* ============================================================
     5. BEFORE / AFTER COMPARISON SLIDER
     Clip-path no elemento .comparison__after controlado pelo handle
     Suporte a: mouse drag, touch drag, clique direto, teclado (←→)
     ============================================================ */
  var slider = document.getElementById('comparison-slider');

  if (slider) {
    var afterEl     = slider.querySelector('.comparison__after');
    var handleEl    = document.getElementById('comparison-handle');
    var isDragging  = false;

    /**
     * Posiciona o handle e atualiza o clip-path do "after"
     * pct: 0-100 (posição do handle em % da largura do slider)
     *   pct = 0  → after mostra tudo (cobre tudo)
     *   pct = 100 → after oculto (before cobre tudo)
     *   pct = 50  → metade cada
     */
    function setSliderPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));

      // Clip-path inset(top right bottom left):
      // Clipar 'pct' da esquerda → after visível apenas no lado direito
      afterEl.style.clipPath  = 'inset(0 0 0 ' + pct + '%)';
      handleEl.style.left     = pct + '%';
      handleEl.setAttribute('aria-valuenow', Math.round(pct));
    }

    function getPctFromClientX(clientX) {
      var rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    // --- Mouse ---
    slider.addEventListener('mousedown', function (e) {
      isDragging = true;
      setSliderPosition(getPctFromClientX(e.clientX));
      e.preventDefault(); // evita seleção de texto
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      setSliderPosition(getPctFromClientX(e.clientX));
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // --- Touch ---
    slider.addEventListener('touchstart', function (e) {
      isDragging = true;
      setSliderPosition(getPctFromClientX(e.touches[0].clientX));
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      setSliderPosition(getPctFromClientX(e.touches[0].clientX));
    }, { passive: true });

    window.addEventListener('touchend', function () {
      isDragging = false;
    });

    // --- Clique direto no slider ---
    slider.addEventListener('click', function (e) {
      if (!isDragging) {
        setSliderPosition(getPctFromClientX(e.clientX));
      }
    });

    // --- Teclado (acessibilidade) ---
    handleEl.addEventListener('keydown', function (e) {
      var currentPct = parseFloat(handleEl.style.left || '50');
      var step = e.shiftKey ? 10 : 5;
      var newPct = currentPct;

      switch (e.key) {
        case 'ArrowLeft':  newPct = currentPct - step; break;
        case 'ArrowRight': newPct = currentPct + step; break;
        case 'Home':       newPct = 0;   break;
        case 'End':        newPct = 100; break;
        default: return;
      }

      e.preventDefault();
      setSliderPosition(newPct);
    });

    // Inicializa na posição 50%
    setSliderPosition(50);
  }


  /* ============================================================
     6. COUNTERS · Animação de contagem com easeOutCubic
     Dispara quando a seção #numeros entra na viewport
     ============================================================ */
  var counters        = document.querySelectorAll('.stat__value[data-count]');
  var statsSection    = document.getElementById('numeros');
  var countersStarted = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatNumber(n) {
    // Formato pt-BR: 5000 → "5.000"
    return n.toLocaleString('pt-BR');
  }

  function animateCounter(el) {
    var target   = parseInt(el.dataset.count, 10);
    var duration = prefersReducedMotion ? 0 : 2400;
    var start    = performance.now();

    function tick(now) {
      var elapsed  = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var value    = Math.round(easeOutCubic(progress) * target);

      el.textContent = formatNumber(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    // Inicia imediatamente se reducedMotion ou via rAF
    if (duration === 0) {
      el.textContent = formatNumber(target);
    } else {
      requestAnimationFrame(tick);
    }
  }

  if (statsSection && counters.length) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;

            counters.forEach(function (counter, index) {
              // Stagger de 120ms entre cada contador
              setTimeout(function () {
                animateCounter(counter);
              }, index * 120);
            });

            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    statsObserver.observe(statsSection);
  }


  /* ============================================================
     7. FAQ ACCORDION · Accordion ARIA acessível
     Abre/fecha respostas via max-height para transição CSS suave
     ============================================================ */
  var faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    var btn    = item.querySelector('.faq__question');
    var answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // --- Fecha todos os itens ---
      faqItems.forEach(function (otherItem) {
        var otherBtn    = otherItem.querySelector('.faq__question');
        var otherAnswer = otherItem.querySelector('.faq__answer');
        if (otherBtn && otherAnswer) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.style.maxHeight = null;
          otherAnswer.setAttribute('aria-hidden', 'true');
        }
      });

      // --- Abre o clicado (se estava fechado) ---
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        // scrollHeight garante transição suave sem altura fixa
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* ============================================================
     8. SMOOTH SCROLL · Links âncora internos com offset do nav
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMenu(); // fecha menu mobile se aberto

      // Usa a variável CSS --nav-h como offset
      var navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 76;

      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });


  /* ============================================================
     9. FOOTER YEAR · Atualiza o ano dinamicamente
     ============================================================ */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ============================================================
     10. MICROINTERAÇÃO · Hover nos links da nav com highlight
     Pequeno efeito de feedback visual nos links do rodapé
     ============================================================ */
  document.querySelectorAll('.footer__col a').forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      this.style.paddingLeft = '4px';
      this.style.transition  = 'padding var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)';
    });
    link.addEventListener('mouseleave', function () {
      this.style.paddingLeft = '';
    });
  });


  /* ============================================================
     11. WHATSAPP · Botão flutuante + slot Visionmetrics
     ============================================================ */
  function initWhatsAppWidget() {
    var cfg = (window.R5WF_CONFIG && window.R5WF_CONFIG.whatsapp) || {};
    var phone = cfg.phone || '5548984237072';
    var message = encodeURIComponent(cfg.defaultMessage || 'Olá! Vim pelo site R5WF.');
    var href = 'https://api.whatsapp.com/send?phone=' + phone + '&text=' + message;

    if (cfg.visionmetricsScriptUrl) {
      var ext = document.createElement('script');
      ext.src = cfg.visionmetricsScriptUrl;
      ext.defer = true;
      document.body.appendChild(ext);
    }

    if (document.getElementById('wa-float')) return;

    var wrap = document.createElement('div');
    wrap.className = 'wa-float';
    wrap.id = 'wa-float';
    wrap.innerHTML =
      '<span class="wa-float__label">' + (cfg.label || 'Fale conosco no WhatsApp') + '</span>' +
      '<a class="wa-float__btn" href="' + href + '" target="_blank" rel="noopener noreferrer" aria-label="Abrir conversa no WhatsApp">' +
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
          '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
        '</svg>' +
      '</a>';
    document.body.appendChild(wrap);
  }

  initWhatsAppWidget();


  /* ------------------------------------------------------------
     12. LOJAS R5WF · Lista + mapa Leaflet (todas as lojas, foco ao clicar)
     ------------------------------------------------------------ */
  function initLojasPage() {
    var listEl = document.getElementById('lojas-list');
    var mapEl = document.getElementById('lojas-map');
    if (!listEl || !mapEl || !window.R5WF_LOJAS || typeof L === 'undefined') return;

    var stateSelect = document.getElementById('lojas-state');
    var citySelect = document.getElementById('lojas-city');
    var searchInput = document.getElementById('lojas-search');
    var countEl = document.getElementById('lojas-count');
    var mapTitle = document.getElementById('lojas-map-title');
    var mapLink = document.getElementById('lojas-map-link');
    var mapReset = document.getElementById('lojas-map-reset');
    var mapFs = document.getElementById('lojas-map-fs');
    var mapFull = mapEl.closest('.lojas-map-full');
    var data = window.R5WF_LOJAS.slice();
    var activeId = null;
    var defaultHint = 'Todas as lojas R5WF no Brasil. Clique em um pin ou na lista para focar';

    var map = L.map(mapEl, {
      scrollWheelZoom: true,
      zoomControl: true,
    });

    /* Tiles limpos, visual próximo ao Google Maps */
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    var markerLayer = L.layerGroup().addTo(map);
    var markerById = {};
    var defaultBounds = null;

    function phoneHref(phone) {
      if (!phone) return '';
      var digits = phone.replace(/\D/g, '');
      if (digits.length < 10) return '';
      if (!digits.startsWith('55')) digits = '55' + digits;
      return 'tel:+' + digits;
    }

    function jitterCoords(id, lat, lng) {
      var h = 0;
      for (var i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i);
      var angle = (Math.abs(h) % 360) * (Math.PI / 180);
      var radius = 0.004 + (Math.abs(h) % 80) / 20000;
      return [lat + Math.sin(angle) * radius, lng + Math.cos(angle) * radius];
    }

    function makeIcon(isActive) {
      var w = isActive ? 32 : 26;
      var h = Math.round(w * 1.43);
      var fill = isActive ? '#C8102E' : '#EA4335';
      var html =
        '<svg class="map-pin' + (isActive ? ' map-pin--active' : '') + '" viewBox="0 0 28 40" width="' + w + '" height="' + h + '" aria-hidden="true">' +
        '<path fill="' + fill + '" d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z"/>' +
        '<circle fill="#fff" cx="14" cy="14" r="5.5"/>' +
        '</svg>';
      return L.divIcon({
        className: 'map-pin-wrap',
        html: html,
        iconSize: [w, h],
        iconAnchor: [w / 2, h],
        popupAnchor: [0, -h + 4],
      });
    }

    function popupHtml(loja) {
      var tel = phoneHref(loja.phone);
      return '<strong>' + loja.name + '</strong><br>' +
        loja.city + ' · ' + (loja.stateName || loja.state) + '<br>' +
        (loja.phone ? '<a href="' + tel + '">' + loja.phone + '</a><br>' : '') +
        '<a href="' + loja.maps + '" target="_blank" rel="noopener">Como chegar</a>';
    }

    function buildMarkers() {
      markerLayer.clearLayers();
      markerById = {};
      var bounds = [];

      data.forEach(function (loja) {
        if (loja.lat == null || loja.lng == null) return;
        var coords = jitterCoords(loja.id, loja.lat, loja.lng);
        var marker = L.marker(coords, { icon: makeIcon(false) });
        marker.bindPopup(popupHtml(loja));
        marker.on('click', function () {
          focusLoja(loja, { fromMap: true });
        });
        markerLayer.addLayer(marker);
        markerById[loja.id] = marker;
        bounds.push(coords);
      });

      if (bounds.length) {
        defaultBounds = L.latLngBounds(bounds).pad(0.06);
        map.fitBounds(defaultBounds, { animate: false, maxZoom: 5 });
      } else {
        map.setView([-14.5, -52.5], 4);
      }
    }

    function setMarkerActive(id) {
      Object.keys(markerById).forEach(function (key) {
        var m = markerById[key];
        m.setIcon(makeIcon(key === id));
      });
    }

    function focusLoja(loja, opts) {
      opts = opts || {};
      activeId = loja.id;
      setMarkerActive(loja.id);

      if (mapTitle) {
        mapTitle.innerHTML = 'Focando: <strong>' + loja.name + '</strong> · ' + loja.city + '/' + loja.state;
      }
      if (mapLink) {
        mapLink.href = loja.maps;
        mapLink.hidden = false;
      }

      listEl.querySelectorAll('.loja-card').forEach(function (card) {
        var isActive = card.dataset.id === loja.id;
        card.classList.toggle('is-active', isActive);
        if (isActive && !opts.fromMap) {
          card.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
        }
      });

      var marker = markerById[loja.id];
      if (marker) {
        map.flyTo(marker.getLatLng(), 16, { duration: prefersReducedMotion ? 0 : 0.9 });
        marker.openPopup();
      }
    }

    function showAllOnMap(items) {
      var bounds = [];
      items.forEach(function (loja) {
        var marker = markerById[loja.id];
        if (marker) bounds.push(marker.getLatLng());
      });
      if (bounds.length > 1) {
        map.fitBounds(L.latLngBounds(bounds).pad(0.1), { animate: true, maxZoom: 8 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 11);
      } else if (defaultBounds) {
        map.fitBounds(defaultBounds, { animate: true, maxZoom: 5 });
      }
    }

    function clearFocus() {
      activeId = null;
      setMarkerActive(null);
      if (mapTitle) mapTitle.textContent = defaultHint;
      if (mapLink) mapLink.hidden = true;
      listEl.querySelectorAll('.loja-card').forEach(function (card) {
        card.classList.remove('is-active');
      });
      markerLayer.eachLayer(function (layer) {
        if (layer.closePopup) layer.closePopup();
      });
    }

    function uniqueStates() {
      var seen = {};
      return data.filter(function (item) {
        if (!item.state || seen[item.state]) return false;
        seen[item.state] = true;
        return true;
      }).sort(function (a, b) {
        return (a.stateName || a.state).localeCompare(b.stateName || b.state, 'pt-BR');
      });
    }

    function citiesForState(state) {
      return data.filter(function (i) { return !state || i.state === state; })
        .map(function (i) { return i.city; })
        .filter(function (v, idx, arr) { return v && arr.indexOf(v) === idx; })
        .sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); });
    }

    function render() {
      var state = stateSelect ? stateSelect.value : '';
      var city = citySelect ? citySelect.value : '';
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';

      var filtered = data.filter(function (item) {
        if (state && item.state !== state) return false;
        if (city && item.city !== city) return false;
        if (q) {
          var blob = (item.id + ' ' + item.name + ' ' + item.city + ' ' + item.state + ' ' + item.address).toLowerCase();
          if (blob.indexOf(q) === -1) return false;
        }
        return true;
      });

      if (countEl) {
        countEl.textContent = filtered.length + ' loja' + (filtered.length !== 1 ? 's' : '') + ' encontrada' + (filtered.length !== 1 ? 's' : '');
      }

      /* Mostra/oculta marcadores conforme filtro */
      data.forEach(function (loja) {
        var marker = markerById[loja.id];
        if (!marker) return;
        var visible = filtered.some(function (f) { return f.id === loja.id; });
        if (visible) {
          if (!markerLayer.hasLayer(marker)) markerLayer.addLayer(marker);
        } else if (markerLayer.hasLayer(marker)) {
          markerLayer.removeLayer(marker);
        }
      });

      listEl.innerHTML = filtered.map(function (item) {
        var tel = phoneHref(item.phone);
        return '<article class="loja-card' + (item.id === activeId ? ' is-active' : '') + '" data-id="' + item.id + '" tabindex="0" role="button" aria-label="Focar ' + item.name + ' no mapa">' +
          '<div class="loja-card__head"><span class="loja-card__id">' + item.id + '</span><h3 class="loja-card__name">' + item.name + '</h3></div>' +
          '<p class="loja-card__meta">' + item.city + ' · ' + (item.stateName || item.state) + '<br>' + item.address + '</p>' +
          '<div class="loja-card__actions">' +
            (item.phone ? '<a href="' + tel + '">' + item.phone + '</a>' : '') +
            (item.instagram ? '<a href="' + item.instagram + '" target="_blank" rel="noopener noreferrer">Instagram</a>' : '') +
            (item.website ? '<a href="' + item.website + '" target="_blank" rel="noopener noreferrer">Site</a>' : '') +
            '<a href="' + item.maps + '" target="_blank" rel="noopener noreferrer">Como chegar</a>' +
          '</div></article>';
      }).join('');

      if (!filtered.length) {
        listEl.innerHTML = '<p class="loja-card__meta">Nenhuma loja encontrada para os filtros selecionados.</p>';
        return;
      }

      listEl.querySelectorAll('.loja-card').forEach(function (card) {
        var loja = filtered.find(function (l) { return l.id === card.dataset.id; });
        if (!loja) return;
        card.addEventListener('click', function (e) {
          if (e.target.closest('a')) return;
          focusLoja(loja);
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            focusLoja(loja);
          }
        });
      });

      if (activeId && !filtered.some(function (l) { return l.id === activeId; })) {
        clearFocus();
      }

      showAllOnMap(filtered);
    }

    if (mapReset) {
      mapReset.addEventListener('click', function () {
        clearFocus();
        var state = stateSelect ? stateSelect.value : '';
        var city = citySelect ? citySelect.value : '';
        var q = searchInput ? searchInput.value.trim() : '';
        if (!state && !city && !q && defaultBounds) {
          map.fitBounds(defaultBounds, { animate: true, maxZoom: 5 });
        } else {
          showAllOnMap(data.filter(function (item) {
            if (state && item.state !== state) return false;
            if (city && item.city !== city) return false;
            if (q) {
              var blob = (item.id + ' ' + item.name + ' ' + item.city + ' ' + item.state + ' ' + item.address).toLowerCase();
              if (blob.indexOf(q) === -1) return false;
            }
            return true;
          }));
        }
      });
    }

    if (mapFs && mapFull) {
      mapFs.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          mapFull.requestFullscreen().then(function () {
            setTimeout(function () { map.invalidateSize(); }, 200);
          }).catch(function () {});
        } else {
          document.exitFullscreen();
        }
      });
      document.addEventListener('fullscreenchange', function () {
        setTimeout(function () { map.invalidateSize(); }, 200);
      });
    }

    if (stateSelect) {
      uniqueStates().forEach(function (item) {
        var opt = document.createElement('option');
        opt.value = item.state;
        opt.textContent = item.stateName || item.state;
        stateSelect.appendChild(opt);
      });
      stateSelect.addEventListener('change', function () {
        if (citySelect) {
          citySelect.innerHTML = '<option value="">Todas as cidades</option>';
          citiesForState(stateSelect.value).forEach(function (ct) {
            var o = document.createElement('option');
            o.value = ct;
            o.textContent = ct;
            citySelect.appendChild(o);
          });
        }
        clearFocus();
        render();
      });
    }

    if (citySelect) citySelect.addEventListener('change', function () { clearFocus(); render(); });
    if (searchInput) searchInput.addEventListener('input', function () { clearFocus(); render(); });

    buildMarkers();
    render();
    setTimeout(function () { map.invalidateSize(); }, 200);
  }

  function initAutomotivaPage() {
    var grid = document.getElementById('produtos-auto-grid');
    var nav = document.getElementById('auto-products-nav');
    if (!grid || !window.R5WF_PRODUTOS_AUTO) return;

    var tierLabels = {
      flagship: 'Linha flagship',
      premium: 'Linha premium',
      performance: 'Alta performance',
      entry: 'Custo-benefício'
    };

    function slugify(text, index) {
      return 'auto-' + index + '-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    window.R5WF_PRODUTOS_AUTO.forEach(function (p, i) {
      var id = slugify(p.name, i);
      var tier = tierLabels[p.tier] || '';
      var badges = (p.badges || []).map(function (b) {
        return '<span class="auto-showcase__badge">' + escapeHtml(b) + '</span>';
      }).join('');
      var features = p.features.map(function (f) {
        return '<div class="auto-showcase__feature">' +
          '<h4 class="auto-showcase__feature-title">' + escapeHtml(f.title) + '</h4>' +
          '<p class="auto-showcase__feature-text">' + escapeHtml(f.text) + '</p></div>';
      }).join('');
      var reverse = i % 2 === 1 ? ' auto-showcase__item--reverse' : '';
      var navLabel = p.subtitle ? p.name + ' · ' + p.subtitle : p.name;

      if (nav) {
        var link = document.createElement('a');
        link.href = '#' + id;
        link.className = 'auto-nav__pill' + (i === 0 ? ' is-active' : '');
        link.textContent = navLabel;
        nav.appendChild(link);
      }

      var article = document.createElement('article');
      article.className = 'auto-showcase__item' + reverse;
      article.id = id;
      article.setAttribute('data-animate', 'fade-in');
      article.innerHTML =
        '<div class="auto-showcase__visual">' +
          '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" width="580" height="460">' +
        '</div>' +
        '<div class="auto-showcase__body">' +
          (tier ? '<span class="auto-showcase__tier">' + escapeHtml(tier) + '</span>' : '') +
          '<h3 class="auto-showcase__name">' + escapeHtml(p.name) + '</h3>' +
          (p.subtitle ? '<p class="auto-showcase__subtitle">' + escapeHtml(p.subtitle) + '</p>' : '') +
          (badges ? '<div class="auto-showcase__badges">' + badges + '</div>' : '') +
          '<div class="auto-showcase__features">' + features + '</div>' +
          '<div class="auto-showcase__actions">' +
            '<a href="' + escapeHtml(p.boletim) + '" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Boletim Técnico</a>' +
            '<a href="lojas-oficiais.html" class="btn btn--outline">Solicitar orçamento</a>' +
          '</div>' +
        '</div>';
      grid.appendChild(article);
    });

    if (nav && 'IntersectionObserver' in window) {
      var pills = nav.querySelectorAll('.auto-nav__pill');
      var sections = grid.querySelectorAll('.auto-showcase__item');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var idx = Array.prototype.indexOf.call(sections, entry.target);
          pills.forEach(function (pill, pi) {
            pill.classList.toggle('is-active', pi === idx);
          });
        });
      }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });

      sections.forEach(function (section) { observer.observe(section); });
    }

    observeAnimatedElements(grid);
  }

  initAutomotivaPage();
  initLojasPage();

})();
