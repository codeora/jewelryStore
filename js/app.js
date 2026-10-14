/**
 * Maison Aurum — Beirut Fine Jewelry House
 * Core Application Logic & State Management
 * Currency, Cart, Wishlist, Filter, Ring Carat Visualizer, Modals & Lebanese Concierge
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentCurrency: 'USD',
    currentTab: 'all',
    currentSort: 'featured',
    searchQuery: '',
    selectedRingMetal: 'yellow', // 'yellow', 'white', 'rose'
    selectedCarat: '1.00',
    lastViewedProduct: null,
    cart: JSON.parse(localStorage.getItem('maison_aurum_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('maison_aurum_wishlist') || '[]')
  };

  // DOM Elements
  const currencySelect = document.getElementById('currency-select');
  const productGrid = document.getElementById('product-grid');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('search-input');
  const searchResultsDropdown = document.getElementById('search-results-dropdown');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const wishlistToggleBtn = document.getElementById('wishlist-toggle-btn');
  const cartBadge = document.getElementById('cart-badge');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const toastContainer = document.getElementById('toast-container');

  // Drawers
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const wishlistItemsContainer = document.getElementById('wishlist-items-container');
  const cartDrawerSubtotal = document.getElementById('cart-drawer-subtotal');
  const cartShippingMeter = document.getElementById('cart-shipping-meter');

  // Modals
  const modalOverlay = document.getElementById('modal-overlay');
  const quickViewModal = document.getElementById('quickview-modal-content');
  const bespokeModal = document.getElementById('bespoke-modal-content');
  const sizeGuideModal = document.getElementById('sizeguide-modal-content');
  const appointmentModal = document.getElementById('appointment-modal-content');

  // Initialize Hero Slider
  if (typeof HeroSlider !== 'undefined' && typeof HERO_SLIDES !== 'undefined') {
    new HeroSlider('hero-slider', HERO_SLIDES);
  }

  // -------------------------------------------------------------------------
  // Currency Helpers (Supporting USD, LBP, AED, SAR, EUR, CAD, GBP)
  // -------------------------------------------------------------------------
  function formatPrice(usdPrice) {
    const curr = CURRENCIES[state.currentCurrency] || CURRENCIES.USD;

    if (curr.code === 'LBP') {
      // Standard Lebanese Pound market rounding (nearest 1,000 LBP)
      const lbpVal = Math.round((usdPrice * curr.rate) / 1000) * 1000;
      return `${lbpVal.toLocaleString()} LBP`;
    }

    const converted = Math.round(usdPrice * curr.rate);
    const formattedNum = converted.toLocaleString();

    if (curr.code === 'AED' || curr.code === 'SAR' || curr.code === 'CAD') {
      return `${curr.symbol} ${formattedNum}`;
    }
    return `${curr.symbol}${formattedNum}`;
  }

  function handleCurrencyChange(newCurrency) {
    if (!CURRENCIES[newCurrency]) return;
    state.currentCurrency = newCurrency;
    if (currencySelect && currencySelect.value !== newCurrency) {
      currencySelect.value = newCurrency;
    }
    const mobileSel = document.getElementById('mobile-currency-select');
    if (mobileSel && mobileSel.value !== newCurrency) {
      mobileSel.value = newCurrency;
    }
    renderProducts();
    updateCartUI();
    updateWishlistUI();
    showToast(`Currency updated to ${CURRENCIES[newCurrency].label}`);
  }

  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      handleCurrencyChange(e.target.value);
    });
  }

  // -------------------------------------------------------------------------
  // WhatsApp Concierge Helper (Direct to Beirut Workshop & Sales Team)
  // -------------------------------------------------------------------------
  function openWhatsAppInquiry(product = null, customNote = '') {
    const phone = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '96171063529';
    const activeProduct = product || state.lastViewedProduct || (state.cart.length > 0 ? state.cart[0] : null);

    let text = '';
    if (activeProduct) {
      const currentPrice = formatPrice(activeProduct.priceUSD);
      text = `Hello Maison Aurum Concierge,\n\nI would like to inquire about this creation:\n` +
        `• Piece: ${activeProduct.title}\n` +
        `• Reference Code: ${activeProduct.sku}\n` +
        `• Price: ${currentPrice} (USD $${activeProduct.priceUSD.toLocaleString()})\n` +
        (activeProduct.metal ? `• Metal: ${activeProduct.metal}\n` : '') +
        (activeProduct.stone ? `• Stone Details: ${activeProduct.stone}\n` : '') +
        (activeProduct.size ? `• Desired Size / Dimension: ${activeProduct.size}\n` : '') +
        `\nPlease advise on showroom availability (Beirut / Kaslik / Byblos), private viewing, or delivery within Lebanon & abroad.`;
    } else {
      text = `Hello Maison Aurum Concierge, I am browsing your Lebanese jewelry collection and would like personal assistance from your master goldsmith or bridal concierge.`;
    }

    if (customNote) {
      text += `\n\nNote: ${customNote}`;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  function openWhatsAppCart() {
    const phone = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '96171063529';
    if (state.cart.length === 0) {
      openWhatsAppInquiry(null, 'I would like assistance with selecting a piece from your Beirut ateliers.');
      return;
    }

    const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.priceUSD * item.qty), 0);
    const formattedSubtotal = formatPrice(subtotalUSD);

    let text = `Hello Maison Aurum Concierge, I would like to order / inquire about the pieces in my shopping bag:\n\n`;
    state.cart.forEach((item, index) => {
      text += `${index + 1}. *${item.title}* (SKU: ${item.sku})\n   Quantity: ${item.qty} | Size: ${item.size} | Total: ${formatPrice(item.priceUSD * item.qty)}\n`;
    });
    text += `\nEstimated Total: ${formattedSubtotal} (USD $${subtotalUSD.toLocaleString()})\n\nPlease confirm availability, delivery (Lebanon Cash-on-Delivery or Insured Worldwide Courier), and gift packaging.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // Smart Search Catalog (Word Boundaries, Stemming, Synonyms & Multi-field)
  // -------------------------------------------------------------------------
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function matchToken(text, token) {
    if (!token) return false;
    // For short tokens (<= 5 chars), require word boundary to prevent "featuring" or "earring" matching "ring"
    if (token.length <= 5) {
      try {
        const re = new RegExp('\\b' + escapeRegex(token) + '\\b', 'i');
        return re.test(text);
      } catch (e) {
        return text.includes(token);
      }
    }
    return text.includes(token);
  }

  function searchCatalog(query) {
    if (!query || !query.trim()) return [...PRODUCTS];
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    const synonymMap = {
      'ring': ['rings', 'band', 'bands', 'bague', 'solitaire ring', 'cocktail ring'],
      'rings': ['ring', 'bands', 'solitaire rings', 'cocktail rings'],
      'necklace': ['necklaces', 'pendant', 'pendants', 'choker', 'collar', 'sautoir', 'chain', 'medallion', 'medallions'],
      'necklaces': ['necklace', 'pendant', 'pendants', 'choker', 'collar', 'sautoir', 'chain', 'medallions'],
      'pendant': ['necklace', 'necklaces', 'pendants', 'medallion'],
      'pendants': ['necklace', 'necklaces', 'pendant', 'medallions'],
      'bracelet': ['bracelets', 'bangle', 'bangles', 'cuff', 'cuffs', 'tennis bracelet', 'majdoul'],
      'bracelets': ['bracelet', 'bangle', 'bangles', 'cuffs', 'tennis bracelet', 'majdoul'],
      'bangle': ['bracelet', 'bracelets', 'bangles', 'majdoul'],
      'bangles': ['bracelet', 'bracelets', 'bangle', 'majdoul'],
      'earring': ['earrings', 'chandelier earrings', 'studs', 'drops'],
      'earrings': ['earring', 'chandelier earrings', 'studs', 'drops'],
      'gold': ['18k', '18kt', 'yellow gold', 'rose gold', 'white gold', 'solid gold'],
      'diamond': ['diamonds', 'pavé', 'brilliant cut', 'solitaire diamond'],
      'diamonds': ['diamond', 'pavé', 'brilliant cut'],
      'wedding': ['wedding set', 'wedding sets', 'bridal suite', 'suite'],
      'wedding set': ['wedding sets', 'bridal suite', 'wedding', 'suite'],
      'wedding sets': ['wedding set', 'bridal suite', 'wedding', 'suite'],
      'bridal': ['wedding set', 'wedding sets', 'wedding', 'bridal suite', 'solitaire'],
      'solitaire': ['solitaires', 'solitaire ring', 'solitaire diamond'],
      'solitaires': ['solitaire', 'solitaire rings'],
      'emerald': ['emeralds', 'gemstone'],
      'sapphire': ['sapphires', 'gemstone', 'ceylon'],
      'pearl': ['pearls', 'sautoir', 'byblos'],
      'cedar': ['cedars', 'arzeh', 'cedar medallion'],
      'eye': ['evil eye', 'talisman'],
      'khamsa': ['hand of fatima', 'hamsa', 'talisman']
    };

    return PRODUCTS.filter(product => {
      const allText = [
        product.title,
        product.category,
        product.type,
        product.collection,
        product.metal,
        product.stone,
        product.sku,
        product.description,
        ...(product.details || []),
        ...(product.keywords || [])
      ].join(' ').toLowerCase();

      return tokens.every(token => {
        if (matchToken(allText, token)) return true;

        const singular = token.replace(/(?:es|s)$/i, '');
        const plural = singular + 's';
        const pluralEs = singular + 'es';
        if (singular.length >= 3) {
          if (matchToken(allText, singular) || matchToken(allText, plural) || matchToken(allText, pluralEs)) {
            return true;
          }
        }

        const syns = synonymMap[token] || (singular ? synonymMap[singular] : null);
        if (syns && syns.some(s => {
          if (s.includes(' ')) return allText.includes(s);
          return matchToken(allText, s);
        })) {
          return true;
        }

        return false;
      });
    });
  }

  // -------------------------------------------------------------------------
  // Product Filtering & Sorting (Category & Tab Taxonomy)
  // -------------------------------------------------------------------------
  function getFilteredProducts() {
    let list;

    // Search query searches across the entire catalog with smart stemming & synonyms
    if (state.searchQuery.trim() !== '') {
      list = searchCatalog(state.searchQuery);
    } else {
      list = [...PRODUCTS];

      // Filter by Tab / Category
      if (state.currentTab !== 'all') {
        if (state.currentTab === 'rings') {
          list = list.filter(p => p.category === 'Rings' || (p.keywords && p.keywords.includes('ring')));
        } else if (state.currentTab === 'necklaces') {
          list = list.filter(p => p.category === 'Necklaces' || (p.keywords && p.keywords.includes('necklace')));
        } else if (state.currentTab === 'bracelets') {
          list = list.filter(p => p.category === 'Bracelets' || (p.keywords && p.keywords.includes('bracelet')));
        } else if (state.currentTab === 'bridal') {
          list = list.filter(p => p.type === 'bridal' || p.category === 'High Jewelry' || (p.badge && p.badge.includes('Bridal')));
        } else if (state.currentTab === 'gold') {
          list = list.filter(p => p.type === 'gold' || (p.metal && (p.metal.includes('Solid') || p.metal.includes('Yellow Gold'))));
        } else if (state.currentTab === 'heritage') {
          list = list.filter(p => p.type === 'heritage' || (p.collection && (p.collection.includes('Heritage') || p.collection.includes('Talismans') || p.collection.includes('Calligraphy'))));
        } else if (state.currentTab === 'solitaires') {
          list = list.filter(p => p.type === 'solitaires' || p.category === 'Rings' || (p.title && p.title.includes('Solitaire')) || (p.title && p.title.includes('Tennis')));
        } else if (state.currentTab === 'gemstones') {
          list = list.filter(p => p.type === 'gemstones');
        }
      }
    }

    // Sorting
    if (state.currentSort === 'price-low') {
      list.sort((a, b) => a.priceUSD - b.priceUSD);
    } else if (state.currentSort === 'price-high') {
      list.sort((a, b) => b.priceUSD - a.priceUSD);
    } else if (state.currentSort === 'name-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }

  function renderProducts() {
    if (!productGrid) return;
    const items = getFilteredProducts();

    if (items.length === 0) {
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: var(--gold-primary);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 8px;">No Creations Found${state.searchQuery ? ` for "${state.searchQuery}"` : ''}</h3>
          <p style="font-size: 0.9rem; margin-bottom: 20px;">Explore our signature categories below or view the complete catalog:</p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px;">
            <button class="tab-btn search-fallback-tag" data-tab="rings" style="border: 1px solid var(--border-primary);">Rings</button>
            <button class="tab-btn search-fallback-tag" data-tab="necklaces" style="border: 1px solid var(--border-primary);">Necklaces</button>
            <button class="tab-btn search-fallback-tag" data-tab="bracelets" style="border: 1px solid var(--border-primary);">Bracelets</button>
            <button class="tab-btn search-fallback-tag" data-tab="bridal" style="border: 1px solid var(--border-primary);">Wedding Sets</button>
            <button class="tab-btn search-fallback-tag" data-tab="gold" style="border: 1px solid var(--border-primary);">18KT Gold</button>
          </div>
          <button id="reset-filter-btn" class="btn-luxury" style="padding: 10px 28px;">Reset Filters & View All</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.currentTab = 'all';
          state.searchQuery = '';
          if (searchInput) searchInput.value = '';
          tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'all'));
          renderProducts();
        });
      }
      document.querySelectorAll('.search-fallback-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          state.searchQuery = '';
          if (searchInput) searchInput.value = '';
          state.currentTab = tag.dataset.tab;
          tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tag.dataset.tab));
          renderProducts();
        });
      });
      return;
    }

    let searchHeaderHtml = '';
    if (state.searchQuery.trim() !== '') {
      searchHeaderHtml = `
        <div style="grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; background: var(--bg-subtle); border-radius: var(--radius-sm); margin-bottom: 16px; border: 1px solid var(--border-light);">
          <div style="font-size: 0.88rem; color: var(--text-primary);">
            Search results for <strong>"${state.searchQuery}"</strong>
            <span style="color: var(--gold-primary); font-size: 0.82rem; margin-left: 8px;">(${items.length} ${items.length === 1 ? 'creation' : 'creations'} found)</span>
          </div>
          <button id="clear-search-btn" style="background: none; border: none; font-size: 0.82rem; color: var(--text-muted); cursor: pointer; text-decoration: underline;">Clear Search &times;</button>
        </div>
      `;
    }

    productGrid.innerHTML = searchHeaderHtml + items.map((product, idx) => {
      const isWishlisted = state.wishlist.some(w => w.id === product.id);
      const catalogNum = String(idx + 1).padStart(2, '0');
      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-media">
            <div class="card-top-bar">
              <span class="card-catalog-num">№ ${catalogNum}</span>
              <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Save to Wishlist">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-img-bed">
              <img class="product-img primary" src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'">
              <img class="product-img secondary" src="${product.secondaryImage}" alt="${product.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'">
            </div>
            <div class="product-overlay-actions">
              <button class="btn-card-quickview" data-id="${product.id}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Examine Creation</span>
              </button>
            </div>
          </div>
          <div class="product-info">
            <div class="product-meta-row">
              <span class="product-collection-label">${product.collection}</span>
              <span class="product-hallmark-tag">18KT Hallmarked</span>
            </div>
            <h3 class="product-title" title="${product.title}">${product.title}</h3>
            <p class="product-spec">${product.metal} • ${product.stone}</p>
            <div class="product-footer">
              <div class="product-price-wrap">
                <span class="product-price-label">Atelier Price</span>
                <span class="product-price">${formatPrice(product.priceUSD)}</span>
              </div>
              <div class="product-card-btns">
                <button class="btn-card-wa" data-id="${product.id}" title="Direct Beirut WhatsApp Consultation">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.09-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.25-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
                </button>
                <button class="btn-card-add" data-id="${product.id}" title="Add to Presentation Chest">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    bindProductCardEvents();

    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        renderProducts();
      });
    }
  }

  function bindProductCardEvents() {
    // Quick View
    document.querySelectorAll('.btn-card-quickview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openQuickView(id);
      });
    });

    // Add to Bag
    document.querySelectorAll('.btn-card-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) {
          addToCart(prod, prod.sizes ? prod.sizes[0] : 'Standard', 1);
        }
      });
    });

    // Direct WhatsApp from Card
    document.querySelectorAll('.btn-card-wa').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) {
          openWhatsAppInquiry(prod);
        }
      });
    });

    // Wishlist
    document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) {
          toggleWishlist(prod);
        }
      });
    });

    // Touch / Mobile Card Click -> Quick View
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        const id = card.dataset.id;
        if (id) openQuickView(id);
      });
    });
  }

  // Tab Filtering Events
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.searchQuery = '';
      if (searchInput) searchInput.value = '';
      state.currentTab = e.currentTarget.dataset.tab;
      renderProducts();
    });
  });

  // Sort Selection
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.currentSort = e.target.value;
      renderProducts();
    });
  }

  // Live Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      state.searchQuery = val;
      if (val !== '') {
        state.currentTab = 'all';
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'all'));
      }
      renderProducts();

      // Dropdown autocomplete using smart searchCatalog
      if (val.length >= 2) {
        const matches = searchCatalog(val).slice(0, 6);

        if (matches.length > 0) {
          searchResultsDropdown.innerHTML = matches.map(p => `
            <div class="search-result-item" data-id="${p.id}">
              <img class="search-result-thumb" src="${p.image}" alt="${p.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'">
              <div class="search-result-info">
                <div class="search-result-title">${p.title}</div>
                <div class="search-result-meta">${formatPrice(p.priceUSD)} • ${p.category}</div>
              </div>
            </div>
          `).join('');
          searchResultsDropdown.classList.add('active');

          searchResultsDropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
              openQuickView(item.dataset.id);
              searchResultsDropdown.classList.remove('active');
            });
          });
        } else {
          searchResultsDropdown.classList.remove('active');
        }
      } else {
        searchResultsDropdown.classList.remove('active');
      }
    });

    // Enter key submits search and scrolls to products showcase
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = searchInput.value.trim();
        state.searchQuery = val;
        state.currentTab = 'all';
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'all'));
        renderProducts();
        if (searchResultsDropdown) searchResultsDropdown.classList.remove('active');
        const showcase = document.getElementById('products-showcase');
        if (showcase) {
          showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResultsDropdown.contains(e.target)) {
        searchResultsDropdown.classList.remove('active');
      }
    });
  }

  // -------------------------------------------------------------------------
  // Shopping Cart Logic
  // -------------------------------------------------------------------------
  function addToCart(product, size = 'Standard', qty = 1) {
    const existingIndex = state.cart.findIndex(item => item.id === product.id && item.size === size);
    if (existingIndex > -1) {
      state.cart[existingIndex].qty += qty;
    } else {
      state.cart.push({
        id: product.id,
        sku: product.sku,
        title: product.title,
        priceUSD: product.priceUSD,
        image: product.image,
        metal: product.metal,
        size: size,
        qty: qty
      });
    }

    saveCart();
    updateCartUI();
    openDrawer('cart');
    showToast(`Added "${product.title}" to Shopping Bag`);
  }

  function removeFromCart(index) {
    const item = state.cart[index];
    state.cart.splice(index, 1);
    saveCart();
    updateCartUI();
    if (item) showToast(`Removed "${item.title}" from Bag`);
  }

  function updateCartQty(index, delta) {
    state.cart[index].qty += delta;
    if (state.cart[index].qty <= 0) {
      removeFromCart(index);
    } else {
      saveCart();
      updateCartUI();
    }
  }

  function saveCart() {
    localStorage.setItem('maison_aurum_cart', JSON.stringify(state.cart));
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.priceUSD * item.qty), 0);

    if (cartBadge) cartBadge.textContent = totalItems;
    const bbarCartBadge = document.getElementById('bbar-cart-badge');
    if (bbarCartBadge) bbarCartBadge.textContent = totalItems;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotalUSD);
    if (cartDrawerSubtotal) cartDrawerSubtotal.textContent = formatPrice(subtotalUSD);

    // Free delivery threshold in Lebanon & Diaspora ($500 USD)
    const threshold = 500;
    if (cartShippingMeter) {
      const pct = Math.min(100, Math.round((subtotalUSD / threshold) * 100));
      const meterFill = cartShippingMeter.querySelector('.meter-fill');
      const meterLabel = cartShippingMeter.querySelector('.meter-label');
      if (meterFill) meterFill.style.width = `${pct}%`;
      if (meterLabel) {
        if (subtotalUSD >= threshold) {
          meterLabel.innerHTML = '✨ Qualified for <strong>Free Insured Express Delivery</strong> across Lebanon & Overseas!';
        } else {
          const remaining = threshold - subtotalUSD;
          meterLabel.innerHTML = `Add <strong>${formatPrice(remaining)}</strong> more to receive Free Armored Delivery.`;
        }
      }
    }

    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="drawer-empty-msg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <p style="font-size: 1.05rem; font-family: var(--font-serif); margin-bottom: 6px;">Your Shopping Bag is Empty</p>
          <p style="font-size: 0.82rem;">Discover our Lebanese bridal suites, 18KT gold, and heritage talismans.</p>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = state.cart.map((item, idx) => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <div class="cart-item-sku">${item.sku}</div>
          <div class="cart-item-size">Size: ${item.size}</div>
          <div class="cart-item-price">${formatPrice(item.priceUSD * item.qty)}</div>
          <div class="cart-item-qty-row">
            <div class="qty-control">
              <button class="qty-btn" data-index="${idx}" data-delta="-1">-</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" data-index="${idx}" data-delta="1">+</button>
            </div>
            <span class="cart-item-remove" data-index="${idx}">Remove</span>
          </div>
        </div>
      </div>
    `).join('');

    // Bind quantity and remove buttons
    cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        const delta = parseInt(e.currentTarget.dataset.delta, 10);
        updateCartQty(idx, delta);
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        removeFromCart(idx);
      });
    });
  }

  // -------------------------------------------------------------------------
  // Wishlist Logic
  // -------------------------------------------------------------------------
  function toggleWishlist(product) {
    const idx = state.wishlist.findIndex(item => item.id === product.id);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast(`Removed from Wishlist`);
    } else {
      state.wishlist.push({
        id: product.id,
        sku: product.sku,
        title: product.title,
        priceUSD: product.priceUSD,
        image: product.image,
        metal: product.metal
      });
      showToast(`Saved to your Wishlist`);
    }

    localStorage.setItem('maison_aurum_wishlist', JSON.stringify(state.wishlist));
    updateWishlistUI();
    renderProducts();
  }

  function updateWishlistUI() {
    if (wishlistBadge) wishlistBadge.textContent = state.wishlist.length;
    const bbarWishlistBadge = document.getElementById('bbar-wishlist-badge');
    if (bbarWishlistBadge) bbarWishlistBadge.textContent = state.wishlist.length;
    if (!wishlistItemsContainer) return;

    if (state.wishlist.length === 0) {
      wishlistItemsContainer.innerHTML = `
        <div class="drawer-empty-msg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <p style="font-size: 1.05rem; font-family: var(--font-serif); margin-bottom: 6px;">Your Wishlist is Empty</p>
          <p style="font-size: 0.82rem;">Save your favorite Lebanese fine jewelry pieces to review later.</p>
        </div>
      `;
      return;
    }

    wishlistItemsContainer.innerHTML = state.wishlist.map((item, idx) => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <div class="cart-item-sku">${item.sku}</div>
          <div class="cart-item-price">${formatPrice(item.priceUSD)}</div>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <button class="btn-luxury btn-wishlist-move" data-id="${item.id}" style="padding: 6px 12px; font-size: 0.7rem;">Move to Bag</button>
            <button class="btn-wishlist-remove" data-index="${idx}" style="font-size: 0.72rem; color: var(--text-muted); text-decoration: underline;">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    wishlistItemsContainer.querySelectorAll('.btn-wishlist-move').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) {
          addToCart(prod, prod.sizes ? prod.sizes[0] : 'Standard', 1);
          toggleWishlist(prod);
        }
      });
    });

    wishlistItemsContainer.querySelectorAll('.btn-wishlist-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        state.wishlist.splice(idx, 1);
        localStorage.setItem('maison_aurum_wishlist', JSON.stringify(state.wishlist));
        updateWishlistUI();
        renderProducts();
        showToast('Item removed from Wishlist');
      });
    });
  }

  // -------------------------------------------------------------------------
  // Drawer Toggling
  // -------------------------------------------------------------------------
  function openDrawer(type) {
    closeAllModals();
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    if (type === 'cart' && cartDrawer) cartDrawer.classList.add('active');
    if (type === 'wishlist' && wishlistDrawer) wishlistDrawer.classList.add('active');
  }

  function closeAllDrawers() {
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (wishlistDrawer) wishlistDrawer.classList.remove('active');
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => openDrawer('cart'));
  if (wishlistToggleBtn) wishlistToggleBtn.addEventListener('click', () => openDrawer('wishlist'));
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeAllDrawers);

  document.querySelectorAll('.drawer-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllDrawers);
  });

  // Cart WhatsApp Order button
  const cartWhatsAppBtn = document.getElementById('cart-whatsapp-btn');
  if (cartWhatsAppBtn) {
    cartWhatsAppBtn.addEventListener('click', () => {
      openWhatsAppCart();
    });
  }

  // -------------------------------------------------------------------------
  // Modals Management
  // -------------------------------------------------------------------------
  function openModal(modalContentEl) {
    closeAllDrawers();
    [quickViewModal, bespokeModal, sizeGuideModal, appointmentModal].forEach(m => {
      if (m) m.style.display = 'none';
    });

    if (modalContentEl) {
      modalContentEl.style.display = 'block';
      if (modalOverlay) modalOverlay.classList.add('active');
    }
  }

  // Helper to retrieve all photos for a product
  function getProductImages(product) {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return [...product.images];
    }
    const arr = [];
    if (product.image) arr.push(product.image);
    if (product.secondaryImage && product.secondaryImage !== product.image) arr.push(product.secondaryImage);
    return arr.length > 0 ? arr : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'];
  }

  let activeQuickViewKeyHandler = null;

  function closeAllModals() {
    if (modalOverlay) modalOverlay.classList.remove('active');
    if (activeQuickViewKeyHandler) {
      document.removeEventListener('keydown', activeQuickViewKeyHandler);
      activeQuickViewKeyHandler = null;
    }
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeAllModals();
    });
  }

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Quick View Modal with Multi-Photo Horizontal Scroll Gallery
  function openQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !quickViewModal) return;

    state.lastViewedProduct = product;
    const productImages = getProductImages(product);

    quickViewModal.innerHTML = `
      <button class="modal-close-btn" aria-label="Close Modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="quickview-grid">
        <div class="quickview-gallery" id="quickview-gallery-wrapper">
          <div class="quickview-slider" id="quickview-slider" tabindex="0" aria-label="Jewelry photo gallery">
            ${productImages.map((imgSrc, idx) => `
              <div class="quickview-slide" data-index="${idx}">
                <img class="quickview-slide-img" src="${imgSrc}" alt="${product.title} - Photo ${idx + 1}" loading="${idx === 0 ? 'eager' : 'lazy'}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'">
              </div>
            `).join('')}
          </div>

          ${productImages.length > 1 ? `
            <button class="quickview-nav-btn prev" id="qv-prev-btn" aria-label="Previous photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="quickview-nav-btn next" id="qv-next-btn" aria-label="Next photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            <div class="quickview-badge-counter" id="qv-counter">
              <span id="qv-current-num">1</span> / <span>${productImages.length}</span>
            </div>
            <div class="quickview-dots" id="qv-dots">
              ${productImages.map((_, idx) => `
                <button class="quickview-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Go to photo ${idx + 1}"></button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="quickview-info">
          <div class="quickview-sku">${product.sku} • ${product.collection}</div>
          <h2 class="quickview-title">${product.title}</h2>
          <div class="quickview-price">${formatPrice(product.priceUSD)}</div>
          <p class="quickview-desc">${product.description}</p>
          <ul class="quickview-spec-list">
            ${product.details.map(d => `<li>${d}</li>`).join('')}
          </ul>
          ${product.sizes ? `
            <div class="quickview-options">
              <label class="option-label">Select Ring Size (French / US) or Length:</label>
              <select class="size-select-box" id="modal-size-select">
                ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
          ` : ''}
          <div class="quickview-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn-luxury" id="modal-add-btn" style="flex: 1.4; padding: 12px 16px;">Add to Bag</button>
            <button class="btn-whatsapp" id="modal-whatsapp-btn" style="flex: 1.8; padding: 12px 16px;">
              <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.09-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.25-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
              Contact us
            </button>
            <button class="btn-outline-light" id="modal-wishlist-btn" style="color: var(--text-primary); border-color: var(--border-primary); padding: 12px 14px;">Save</button>
          </div>
        </div>
      </div>
    `;

    // Bind Gallery Slider interactions
    const slider = quickViewModal.querySelector('#quickview-slider');
    const prevBtn = quickViewModal.querySelector('#qv-prev-btn');
    const nextBtn = quickViewModal.querySelector('#qv-next-btn');
    const dots = quickViewModal.querySelectorAll('.quickview-dot');
    const currentNum = quickViewModal.querySelector('#qv-current-num');

    if (slider) {
      let scrollRaf = null;

      const updateActiveSlide = () => {
        const slideWidth = slider.clientWidth || 1;
        const activeIdx = Math.min(
          productImages.length - 1,
          Math.max(0, Math.round(slider.scrollLeft / slideWidth))
        );
        if (currentNum) currentNum.textContent = (activeIdx + 1);
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIdx);
        });
      };

      slider.addEventListener('scroll', () => {
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(updateActiveSlide);
      }, { passive: true });

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const slideWidth = slider.clientWidth;
          slider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const slideWidth = slider.clientWidth;
          slider.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });
      }

      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(dot.dataset.index, 10);
          const slideWidth = slider.clientWidth;
          slider.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
        });
      });

      // Mouse drag-to-scroll support for desktop
      let isDown = false;
      let startX = 0;
      let scrollStart = 0;

      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollStart = slider.scrollLeft;
      });

      const onMouseUp = () => {
        if (isDown) {
          isDown = false;
          slider.classList.remove('dragging');
        }
      };
      window.addEventListener('mouseup', onMouseUp);

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollStart - walk;
      });

      // Keyboard left/right arrow navigation
      if (activeQuickViewKeyHandler) {
        document.removeEventListener('keydown', activeQuickViewKeyHandler);
      }
      activeQuickViewKeyHandler = (e) => {
        if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
          slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
        } else if (e.key === 'ArrowRight') {
          slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
        }
      };
      document.addEventListener('keydown', activeQuickViewKeyHandler);
    }


    quickViewModal.querySelector('.modal-close-btn').addEventListener('click', closeAllModals);

    const addBtn = quickViewModal.querySelector('#modal-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const sizeSelect = quickViewModal.querySelector('#modal-size-select');
        const selectedSize = sizeSelect ? sizeSelect.value : 'Standard';
        addToCart(product, selectedSize, 1);
        closeAllModals();
      });
    }

    const wishBtn = quickViewModal.querySelector('#modal-wishlist-btn');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        toggleWishlist(product);
        closeAllModals();
      });
    }

    const waBtn = quickViewModal.querySelector('#modal-whatsapp-btn');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const sizeSelect = quickViewModal.querySelector('#modal-size-select');
        const selectedSize = sizeSelect ? sizeSelect.value : 'Standard';
        openWhatsAppInquiry({
          ...product,
          size: selectedSize
        });
      });
    }

    openModal(quickViewModal);
  }
  window.openQuickView = openQuickView;

  // Floating Movable WhatsApp Concierge Button (Desktop & Mobile)
  const floatingWhatsAppBtn = document.getElementById('floating-whatsapp-btn');
  const floatingWhatsAppContainer = document.querySelector('.concierge-float');

  if (floatingWhatsAppBtn && floatingWhatsAppContainer) {
    let isPointerDown = false;
    let isDragging = false;
    let hasDragged = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let startElemLeft = 0;
    let startElemTop = 0;
    let activePointerId = null;

    function getSafeBounds(rect) {
      const margin = 10;
      const w = rect ? rect.width : floatingWhatsAppContainer.offsetWidth || 50;
      const h = rect ? rect.height : floatingWhatsAppContainer.offsetHeight || 50;
      return {
        minX: margin,
        maxX: Math.max(margin, window.innerWidth - w - margin),
        minY: margin,
        maxY: Math.max(margin, window.innerHeight - h - margin)
      };
    }

    function clamp(val, min, max) {
      return Math.max(min, Math.min(val, max));
    }

    function onPointerDown(e) {
      // Allow only primary touch or left-click
      if (e.button !== undefined && e.button !== 0) return;

      isPointerDown = true;
      isDragging = false;
      hasDragged = false;
      activePointerId = e.pointerId;
      startPointerX = e.clientX;
      startPointerY = e.clientY;

      const rect = floatingWhatsAppContainer.getBoundingClientRect();
      startElemLeft = rect.left;
      startElemTop = rect.top;

      try {
        floatingWhatsAppBtn.setPointerCapture(e.pointerId);
      } catch (_) {}
    }

    function onPointerMove(e) {
      if (!isPointerDown) return;

      const dx = e.clientX - startPointerX;
      const dy = e.clientY - startPointerY;

      if (!isDragging) {
        if (Math.hypot(dx, dy) >= 6) {
          isDragging = true;
          hasDragged = true;
          floatingWhatsAppContainer.classList.add('is-dragging', 'is-moved');
        }
      }

      if (isDragging) {
        if (e.cancelable) {
          e.preventDefault();
        }
        const rect = floatingWhatsAppContainer.getBoundingClientRect();
        const bounds = getSafeBounds(rect);
        const targetLeft = clamp(startElemLeft + dx, bounds.minX, bounds.maxX);
        const targetTop = clamp(startElemTop + dy, bounds.minY, bounds.maxY);

        floatingWhatsAppContainer.style.setProperty('left', `${targetLeft}px`, 'important');
        floatingWhatsAppContainer.style.setProperty('top', `${targetTop}px`, 'important');
        floatingWhatsAppContainer.style.setProperty('bottom', 'auto', 'important');
        floatingWhatsAppContainer.style.setProperty('right', 'auto', 'important');
      }
    }

    function onPointerUp(e) {
      if (!isPointerDown) return;
      isPointerDown = false;

      if (activePointerId !== null) {
        try {
          if (floatingWhatsAppBtn.hasPointerCapture(activePointerId)) {
            floatingWhatsAppBtn.releasePointerCapture(activePointerId);
          }
        } catch (_) {}
        activePointerId = null;
      }

      if (isDragging) {
        floatingWhatsAppContainer.classList.remove('is-dragging');
        try {
          const rect = floatingWhatsAppContainer.getBoundingClientRect();
          sessionStorage.setItem('maison_wa_btn_pos', JSON.stringify({ left: rect.left, top: rect.top }));
        } catch (_) {}
      }

      // Keep hasDragged true briefly so the ensuing synthetic click is cancelled
      setTimeout(() => {
        isDragging = false;
        hasDragged = false;
      }, 120);
    }

    function onPointerCancel(e) {
      onPointerUp(e);
    }

    floatingWhatsAppBtn.addEventListener('pointerdown', onPointerDown);
    floatingWhatsAppBtn.addEventListener('pointermove', onPointerMove);
    floatingWhatsAppBtn.addEventListener('pointerup', onPointerUp);
    floatingWhatsAppBtn.addEventListener('pointercancel', onPointerCancel);

    // Click event: cancel if user dragged, otherwise open WhatsApp inquiry
    floatingWhatsAppBtn.addEventListener('click', (e) => {
      if (hasDragged || isDragging) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      openWhatsAppInquiry();
    }, true);

    // Keep button inside screen on window resize or device orientation change
    window.addEventListener('resize', () => {
      if (floatingWhatsAppContainer.classList.contains('is-moved')) {
        const rect = floatingWhatsAppContainer.getBoundingClientRect();
        const bounds = getSafeBounds(rect);
        const clampedX = clamp(rect.left, bounds.minX, bounds.maxX);
        const clampedY = clamp(rect.top, bounds.minY, bounds.maxY);
        floatingWhatsAppContainer.style.setProperty('left', `${clampedX}px`, 'important');
        floatingWhatsAppContainer.style.setProperty('top', `${clampedY}px`, 'important');
      }
    });

    // Restore user-positioned location from session storage if valid
    try {
      const savedPos = sessionStorage.getItem('maison_wa_btn_pos');
      if (savedPos) {
        const pos = JSON.parse(savedPos);
        if (typeof pos.left === 'number' && typeof pos.top === 'number') {
          const bounds = getSafeBounds();
          const restoredX = clamp(pos.left, bounds.minX, bounds.maxX);
          const restoredY = clamp(pos.top, bounds.minY, bounds.maxY);
          floatingWhatsAppContainer.classList.add('is-moved');
          floatingWhatsAppContainer.style.setProperty('left', `${restoredX}px`, 'important');
          floatingWhatsAppContainer.style.setProperty('top', `${restoredY}px`, 'important');
          floatingWhatsAppContainer.style.setProperty('bottom', 'auto', 'important');
          floatingWhatsAppContainer.style.setProperty('right', 'auto', 'important');
        }
      }
    } catch (_) {}
  }

  // All custom inquiry buttons redirect to Lebanese WhatsApp
  document.querySelectorAll('.open-whatsapp-concierge').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsAppInquiry(null, 'I would like to discuss a custom wedding set or 18KT gold commission.');
    });
  });

  // Sizing Guide Modal Trigger
  document.querySelectorAll('.open-sizeguide-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(sizeGuideModal);
    });
  });

  // Appointment Modal Trigger
  document.querySelectorAll('.open-appointment-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const city = e.currentTarget.dataset.city || 'Beirut';
      const citySelect = document.getElementById('appointment-city-select');
      if (citySelect) citySelect.value = city;
      openModal(appointmentModal);
    });
  });

  // Lookbook Shoppable Editorial Items (opens Quick View)
  document.querySelectorAll('.lookbook-item').forEach(item => {
    const openItem = (e) => {
      if (e) e.preventDefault();
      const id = item.dataset.id;
      if (id) {
        openQuickView(id);
      }
    };
    item.addEventListener('click', openItem);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openItem(e);
      }
    });
  });

  // Custom Wedding Set & Solitaire WhatsApp Direct Redirection
  function openWhatsAppWeddingSet() {
    const phone = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '96171063529';
    const text = `Hello Maison Aurum Concierge,\n\nI would like to consult with your master goldsmith regarding a *Custom Wedding Set & Solitaire* or bespoke diamond commission from your Beirut atelier.\n\nPlease guide me on scheduling a private design session or consultation.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
  // Custom Wedding Set & Solitaire buttons redirect directly to WhatsApp
  document.querySelectorAll('.open-wedding-set-whatsapp, .open-bespoke-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsAppWeddingSet();
    });
  });

  // Size Guide Tab Switcher
  const guideTabBtns = document.querySelectorAll('.guide-tab-btn');
  guideTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      guideTabBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const target = e.currentTarget.dataset.panel;
      document.querySelectorAll('.guide-panel').forEach(p => {
        p.classList.toggle('active', p.id === target);
      });
    });
  });

  // -------------------------------------------------------------------------
  // SOLITAIRE RING-FORM CARAT VISUALIZER (Requested by User)
  // -------------------------------------------------------------------------
  const CARAT_DATA = {
    '0.50': {
      carat: '0.50 ct',
      mm: '5.1 mm',
      crownHeight: '3.1 mm',
      macroRadius: 25,
      macroCy: 92,
      fingerDiamondWidthPx: 25,
      fingerCoveragePercent: 31,
      fingerCoverage: '~31% of finger width (EU 52 / US 6)',
      cutQuality: 'GIA Triple-Ex • 57 Facets (F / VVS1)',
      styleTip: 'Classic understated elegance. Ideal for delicate 4-prong or 6-prong solitaire bands with minimal profile.',
      beirutRecommendation: 'Popular for promise rings and everyday stackable diamond solitaires.'
    },
    '1.00': {
      carat: '1.00 ct',
      mm: '6.5 mm',
      crownHeight: '4.1 mm',
      macroRadius: 33,
      macroCy: 84,
      fingerDiamondWidthPx: 32,
      fingerCoveragePercent: 39,
      fingerCoverage: '~39% of finger width (EU 52 / US 6)',
      cutQuality: 'GIA Triple-Ex • 57 Facets (F / VVS1)',
      styleTip: 'The benchmark of luxury engagement rings. Perfectly balanced brilliance that catches eye-level light effortlessly.',
      beirutRecommendation: 'The most requested Lebanese bridal engagement solitaire size across our Downtown Beirut boutique.'
    },
    '1.50': {
      carat: '1.50 ct',
      mm: '7.4 mm',
      crownHeight: '4.6 mm',
      macroRadius: 40,
      macroCy: 76,
      fingerDiamondWidthPx: 36,
      fingerCoveragePercent: 45,
      fingerCoverage: '~45% of finger width (EU 52 / US 6)',
      cutQuality: 'GIA Triple-Ex • 57 Facets (F / VVS1)',
      styleTip: 'Striking presence with elevated crown profile. Complements pavé diamond shoulders and contoured wedding bands.',
      beirutRecommendation: 'A statement choice for couples seeking dramatic diamond fire without high-jewelry scale.'
    },
    '2.00': {
      carat: '2.00 ct',
      mm: '8.2 mm',
      crownHeight: '5.1 mm',
      macroRadius: 47,
      macroCy: 69,
      fingerDiamondWidthPx: 40,
      fingerCoveragePercent: 50,
      fingerCoverage: '~50% of finger width (EU 52 / US 6)',
      cutQuality: 'GIA Triple-Ex • 57 Facets (F / VVS1)',
      styleTip: 'Substantial high-jewelry grandeur. Half the width of an average finger covered in pure diamond facet brilliance.',
      beirutRecommendation: 'Favored by Lebanese high society; pairs gorgeously with our matching Riviera tennis bracelet.'
    },
    '3.00': {
      carat: '3.00 ct',
      mm: '9.4 mm',
      crownHeight: '5.8 mm',
      macroRadius: 56,
      macroCy: 60,
      fingerDiamondWidthPx: 46,
      fingerCoveragePercent: 57,
      fingerCoverage: '~57% of finger width (EU 52 / US 6)',
      cutQuality: 'GIA Triple-Ex • 57 Facets (F / VVS1)',
      styleTip: 'Magnificent museum-grade solitaire. Demands our master Kaslik goldsmith platinum gallery for ultimate security.',
      beirutRecommendation: 'Custom commissioned for grand Lebanese weddings and prestigious family heirloom collections.'
    }
  };

  const ringCards = document.querySelectorAll('.ring-carat-card');
  const metalPills = document.querySelectorAll('.metal-pill-btn');
  const previewCaratBadge = document.getElementById('preview-carat-badge');
  const previewMmText = document.getElementById('preview-mm-text');
  const previewCoverageText = document.getElementById('preview-coverage-text');
  const previewCutText = document.getElementById('preview-cut-text');
  const previewMetalText = document.getElementById('preview-metal-text');
  const previewTipText = document.getElementById('preview-tip-text');
  const visualizerContainer = document.getElementById('ring-visualizer-container');
  const selectedRingPreviewBox = document.querySelector('.selected-ring-preview-box');
  const commissionSolitaireBtn = document.getElementById('commission-solitaire-btn');

  // Interactive Stage Elements
  const stageViewButtons = document.querySelectorAll('.stage-view-btn');
  const macroRingRender = document.getElementById('macro-ring-render');
  const macroDiaWidthLabel = document.getElementById('macro-dia-width-label');
  const macroCrownLabel = document.getElementById('macro-crown-label');
  const macroHallmarkLabel = document.getElementById('macro-hallmark-label');
  const fingerRenderCanvas = document.getElementById('finger-render-canvas');
  const fingerCoverageGaugeVal = document.getElementById('finger-coverage-gauge-val');
  const fingerCoverageGaugeBar = document.getElementById('finger-coverage-gauge-bar');
  const compareStoneItems = document.querySelectorAll('.compare-stone-item');

  function renderMacroRingSVG(data) {
    const cx = 120;
    const cy = data.macroCy;
    const R = data.macroRadius;
    const r = Math.round(R * 0.54 * 10) / 10;

    const t = [];
    for (let i = 0; i < 8; i++) {
      const ang = (22.5 + i * 45) * (Math.PI / 180);
      t.push([Math.round((cx + r * Math.cos(ang)) * 10) / 10, Math.round((cy + r * Math.sin(ang)) * 10) / 10]);
    }

    const k = [];
    for (let i = 0; i < 8; i++) {
      const ang = (i * 45) * (Math.PI / 180);
      k.push([Math.round((cx + R * Math.cos(ang)) * 10) / 10, Math.round((cy + R * Math.sin(ang)) * 10) / 10]);
    }

    const g = [];
    for (let i = 0; i < 16; i++) {
      const ang = (i * 22.5) * (Math.PI / 180);
      g.push([Math.round((cx + R * Math.cos(ang)) * 10) / 10, Math.round((cy + R * Math.sin(ang)) * 10) / 10]);
    }

    const gal_y1 = Math.round((cy + R * 0.7) * 10) / 10;
    const gal_y2 = Math.round((cy + R * 0.95 + 10) * 10) / 10;

    let arrowsHtml = '';
    for (let i = 0; i < 8; i++) {
      const cls = (i % 2 === 0) ? 'dia-arrow-0' : 'dia-arrow-1';
      arrowsHtml += `<polygon points="${cx},${cy} ${t[i][0]},${t[i][1]} ${k[i][0]},${k[i][1]} ${t[(i + 7) % 8][0]},${t[(i + 7) % 8][1]}" class="dia-facet dia-arrow ${cls}" />`;
    }

    let girdlesHtml = '';
    for (let i = 0; i < 8; i++) {
      const g_mid = g[(2 * i + 1) % 16];
      girdlesHtml += `<polygon points="${k[i][0]},${k[i][1]} ${g_mid[0]},${g_mid[1]} ${t[i][0]},${t[i][1]}" class="dia-facet dia-girdle-facet tone-${i % 3}" />`;
      girdlesHtml += `<polygon points="${g_mid[0]},${g_mid[1]} ${k[(i + 1) % 8][0]},${k[(i + 1) % 8][1]} ${t[i][0]},${t[i][1]}" class="dia-facet dia-girdle-facet tone-${(i + 1) % 3}" />`;
    }

    let starsHtml = '';
    for (let i = 0; i < 8; i++) {
      starsHtml += `<polygon points="${t[i][0]},${t[i][1]} ${t[(i + 1) % 8][0]},${t[(i + 1) % 8][1]} ${k[(i + 1) % 8][0]},${k[(i + 1) % 8][1]}" class="dia-facet dia-star-facet star-${i % 2}" />`;
    }

    const t_str = t.map(p => `${p[0]},${p[1]}`).join(' ');
    const t_sheen = `${t[5][0]},${t[5][1]} ${t[6][0]},${t[6][1]} ${t[7][0]},${t[7][1]} ${t[0][0]},${t[0][1]} ${cx},${cy}`;

    const sp1_x = Math.round((cx - R * 0.42) * 10) / 10;
    const sp1_y = Math.round((cy - R * 0.42) * 10) / 10;
    const sp1_s = Math.max(6.0, Math.round(R * 0.45 * 10) / 10);

    const sp2_x = Math.round((cx + R * 0.45) * 10) / 10;
    const sp2_y = Math.round((cy + R * 0.28) * 10) / 10;
    const sp2_s = Math.max(4.5, Math.round(R * 0.32 * 10) / 10);

    let prongsHtml = '';
    const p_rad = Math.max(3.0, Math.round(R * 0.11 * 10) / 10);
    for (let i = 0; i < 6; i++) {
      const ang = (30 + i * 60) * (Math.PI / 180);
      const px = Math.round((cx + (R - 0.6) * Math.cos(ang)) * 10) / 10;
      const py = Math.round((cy + (R - 0.6) * Math.sin(ang)) * 10) / 10;
      prongsHtml += `<circle cx="${px}" cy="${py}" r="${p_rad}" class="prong-claw" />`;
      prongsHtml += `<circle cx="${px - 0.6}" cy="${py - 0.8}" r="${Math.round(p_rad * 0.38 * 10) / 10}" fill="#FFFFFF" opacity="0.85" />`;
    }

    return `
      <svg class="macro-stage-svg" viewBox="0 0 240 220">
        <ellipse cx="120" cy="195" rx="80" ry="14" fill="rgba(184, 147, 88, 0.08)" />
        <ellipse cx="120" cy="195" rx="60" ry="8" fill="rgba(0,0,0,0.12)" filter="url(#dia-blur-soft)" />
        <ellipse cx="120" cy="142" rx="65" ry="46" fill="none" class="shank-inner" stroke-width="8" />
        <text x="120" y="178" font-size="6" fill="rgba(255,255,255,0.45)" text-anchor="middle" font-family="monospace" letter-spacing="1">MAISON AURUM • 750</text>
        <ellipse cx="120" cy="142" rx="65" ry="46" fill="none" class="shank-base" stroke-width="11" />
        <ellipse cx="120" cy="142.8" rx="63.5" ry="44.8" fill="none" class="shank-highlight" stroke-width="2.2" stroke="rgba(255,255,255,0.68)" />
        <path d="M${Math.round((cx - R * 0.8) * 10) / 10} ${gal_y1} Q${cx} ${gal_y2} ${Math.round((cx + R * 0.8) * 10) / 10} ${gal_y1}" fill="none" class="prong-gallery" stroke-width="4.5" />
        <path d="M${Math.round((cx - R * 0.5) * 10) / 10} ${gal_y1 + 4} Q${cx} ${gal_y2 + 4} ${Math.round((cx + R * 0.5) * 10) / 10} ${gal_y1 + 4}" fill="none" class="prong-gallery" stroke-width="2.5" />
        
        <circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="url(#dia-base-glow)" opacity="0.9" />
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#dia-depth-body)" stroke="#94A3B8" stroke-width="0.8" />
        ${arrowsHtml}
        ${girdlesHtml}
        ${starsHtml}
        <polygon points="${t_str}" class="dia-table-facet" />
        <polygon points="${t_sheen}" fill="url(#dia-table-glare)" opacity="0.88" />
        
        <g class="dia-glint-group glint-primary" transform="translate(${sp1_x}, ${sp1_y})">
          <circle cx="0" cy="0" r="${Math.round(sp1_s * 0.4 * 10) / 10}" fill="#FFFFFF" opacity="0.95" filter="url(#dia-blur-soft)" />
          <polygon points="0,-${sp1_s} ${Math.round(sp1_s * 0.2 * 10) / 10},-${Math.round(sp1_s * 0.2 * 10) / 10} ${sp1_s},0 ${Math.round(sp1_s * 0.2 * 10) / 10},${Math.round(sp1_s * 0.2 * 10) / 10} 0,{sp1_s} -${Math.round(sp1_s * 0.2 * 10) / 10},${Math.round(sp1_s * 0.2 * 10) / 10} -${sp1_s},0 -${Math.round(sp1_s * 0.2 * 10) / 10},-${Math.round(sp1_s * 0.2 * 10) / 10}" fill="#FFFFFF" opacity="0.98" />
        </g>
        <g class="dia-glint-group glint-secondary" transform="translate(${sp2_x}, ${sp2_y})">
          <circle cx="0" cy="0" r="${Math.round(sp2_s * 0.35 * 10) / 10}" fill="#FFFFFF" opacity="0.9" filter="url(#dia-blur-soft)" />
          <polygon points="0,-${sp2_s} ${Math.round(sp2_s * 0.2 * 10) / 10},-${Math.round(sp2_s * 0.2 * 10) / 10} ${sp2_s},0 ${Math.round(sp2_s * 0.2 * 10) / 10},${Math.round(sp2_s * 0.2 * 10) / 10} 0,{sp2_s} -${Math.round(sp2_s * 0.2 * 10) / 10},${Math.round(sp2_s * 0.2 * 10) / 10} -${sp2_s},0 -${Math.round(sp2_s * 0.2 * 10) / 10},-${Math.round(sp2_s * 0.2 * 10) / 10}" fill="#FFFFFF" opacity="0.95" />
        </g>
        ${prongsHtml}
      </svg>
    `;
  }

  function renderFingerScaleSVG(data) {
    const diaWidthPx = data.fingerDiamondWidthPx;
    const diaRadius = diaWidthPx / 2;
    const cx = 150;
    const cy = 110;
    const fingerLeft = 110;
    const fingerRight = 190;
    const fingerWidth = 80;

    return `
      <svg class="finger-scale-svg" viewBox="0 0 300 200">
        <!-- Definitions for Skin Tone & Finger Shadows -->
        <defs>
          <linearGradient id="finger-skin-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#E5D0C0" />
            <stop offset="25%" stop-color="#F2E3D8" />
            <stop offset="50%" stop-color="#FDF4ED" />
            <stop offset="75%" stop-color="#ECD8CA" />
            <stop offset="100%" stop-color="#D9BEAF" />
          </linearGradient>
          <linearGradient id="finger-knuckle-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(180, 140, 120, 0.25)" />
            <stop offset="100%" stop-color="rgba(180, 140, 120, 0)" />
          </linearGradient>
        </defs>

        <!-- Finger Contour (Standard European Bridal Size EU 52 / US 6, ~16.5 mm width) -->
        <path d="M 112 0 C 112 40, 110 80, 110 110 C 110 145, 112 175, 114 200 L 186 200 C 188 175, 190 145, 190 110 C 190 80, 188 40, 188 0 Z" fill="url(#finger-skin-gradient)" />
        
        <!-- Knuckle Creases -->
        <path d="M 125 50 Q 150 46 175 50" fill="none" stroke="rgba(180, 140, 120, 0.3)" stroke-width="1.2" stroke-linecap="round" />
        <path d="M 130 54 Q 150 51 170 54" fill="none" stroke="rgba(180, 140, 120, 0.2)" stroke-width="0.8" stroke-linecap="round" />

        <!-- Finger Width Dimension Caliper Lines (Top) -->
        <line x1="${fingerLeft}" y1="20" x2="${fingerRight}" y2="20" stroke="#B89358" stroke-width="1.5" stroke-dasharray="2,2" />
        <line x1="${fingerLeft}" y1="14" x2="${fingerLeft}" y2="26" stroke="#B89358" stroke-width="1.5" />
        <line x1="${fingerRight}" y1="14" x2="${fingerRight}" y2="26" stroke="#B89358" stroke-width="1.5" />
        <text x="150" y="16" font-size="8" fill="#8C600B" font-weight="700" text-anchor="middle">16.5 mm Standard Bridal Finger (EU 52 / US 6)</text>

        <!-- Solitaire Ring Band (Mounted on Finger) -->
        <!-- Shadow behind band -->
        <rect x="108" y="106" width="84" height="12" rx="4" fill="rgba(0,0,0,0.12)" filter="url(#dia-blur-soft)" />
        <!-- Band itself -->
        <rect x="109" y="107" width="82" height="9" rx="3.5" class="shank-base" fill="none" stroke-width="7" />
        <line x1="110" y1="108" x2="190" y2="108" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />

        <!-- Mounted Solitaire Diamond -->
        <circle cx="${cx}" cy="${cy}" r="${diaRadius + 3}" fill="url(#dia-base-glow)" opacity="0.9" />
        <circle cx="${cx}" cy="${cy}" r="${diaRadius}" fill="url(#dia-depth-body)" stroke="#94A3B8" stroke-width="0.6" />
        <circle cx="${cx}" cy="${cy}" r="${diaRadius * 0.54}" class="dia-table-facet" />
        <polygon points="${cx},${cy - diaRadius} ${cx + diaRadius * 0.7},${cy - diaRadius * 0.7} ${cx + diaRadius},${cy} ${cx + diaRadius * 0.7},${cy + diaRadius * 0.7} ${cx},${cy + diaRadius} ${cx - diaRadius * 0.7},${cy + diaRadius * 0.7} ${cx - diaRadius},${cy} ${cx - diaRadius * 0.7},${cy - diaRadius * 0.7}" class="dia-facet dia-arrow dia-arrow-0" />
        
        <!-- Prongs (4 prongs gripping on finger view) -->
        <circle cx="${cx - diaRadius * 0.7}" cy="${cy - diaRadius * 0.7}" r="${Math.max(1.8, diaRadius * 0.16)}" class="prong-claw" />
        <circle cx="${cx + diaRadius * 0.7}" cy="${cy - diaRadius * 0.7}" r="${Math.max(1.8, diaRadius * 0.16)}" class="prong-claw" />
        <circle cx="${cx - diaRadius * 0.7}" cy="${cy + diaRadius * 0.7}" r="${Math.max(1.8, diaRadius * 0.16)}" class="prong-claw" />
        <circle cx="${cx + diaRadius * 0.7}" cy="${cy + diaRadius * 0.7}" r="${Math.max(1.8, diaRadius * 0.16)}" class="prong-claw" />

        <!-- Diamond Glint on Hand -->
        <g class="dia-glint-group" transform="translate(${cx - diaRadius * 0.3}, ${cy - diaRadius * 0.3})">
          <circle cx="0" cy="0" r="${diaRadius * 0.25}" fill="#FFFFFF" opacity="0.95" filter="url(#dia-blur-soft)" />
          <polygon points="0,-${diaRadius * 0.45} ${diaRadius * 0.12},-${diaRadius * 0.12} ${diaRadius * 0.45},0 ${diaRadius * 0.12},${diaRadius * 0.12} 0,${diaRadius * 0.45} -${diaRadius * 0.12},${diaRadius * 0.12} -${diaRadius * 0.45},0 -${diaRadius * 0.12},-${diaRadius * 0.12}" fill="#FFFFFF" />
        </g>

        <!-- Diamond Width Dimension Caliper Lines (Bottom) -->
        <line x1="${cx - diaRadius}" y1="138" x2="${cx + diaRadius}" y2="138" stroke="#0284C7" stroke-width="1.5" />
        <line x1="${cx - diaRadius}" y1="133" x2="${cx - diaRadius}" y2="143" stroke="#0284C7" stroke-width="1.5" />
        <line x1="${cx + diaRadius}" y1="133" x2="${cx + diaRadius}" y2="143" stroke="#0284C7" stroke-width="1.5" />
        <text x="${cx}" y="154" font-size="8.5" fill="#0369A1" font-weight="700" text-anchor="middle">${data.carat} (${data.mm}) &bull; ${data.fingerCoveragePercent}% Coverage</text>
      </svg>
    `;
  }

  function updateRingVisualizer() {
    const data = CARAT_DATA[state.selectedCarat] || CARAT_DATA['1.00'];
    const metalName = state.selectedRingMetal === 'yellow' ? '18K Solid Yellow Gold' : (state.selectedRingMetal === 'rose' ? '18K Solid Rose Gold' : '18K Solid White Gold / Platinum');

    if (previewCaratBadge) previewCaratBadge.textContent = data.carat;
    if (previewMmText) previewMmText.textContent = data.mm;
    if (previewCoverageText) previewCoverageText.textContent = data.fingerCoverage;
    if (previewCutText) previewCutText.textContent = data.cutQuality;
    if (previewMetalText) previewMetalText.textContent = `${metalName} (750 Purity)`;
    if (previewTipText) previewTipText.textContent = `${data.styleTip} ${data.beirutRecommendation}`;

    // Update active class on 5 selector cards
    ringCards.forEach(card => {
      const isSelected = card.dataset.carat === state.selectedCarat;
      card.classList.toggle('active', isSelected);
    });

    // Update metal classes on containers
    if (visualizerContainer) {
      visualizerContainer.classList.remove('metal-yellow', 'metal-white', 'metal-rose');
      visualizerContainer.classList.add(`metal-${state.selectedRingMetal}`);
    }
    if (selectedRingPreviewBox) {
      selectedRingPreviewBox.classList.remove('metal-yellow', 'metal-white', 'metal-rose');
      selectedRingPreviewBox.classList.add(`metal-${state.selectedRingMetal}`);
    }

    // Update active metal pills
    metalPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.metal === state.selectedRingMetal);
    });

    // Render View 1: 3D Macro View
    if (macroRingRender) {
      macroRingRender.innerHTML = renderMacroRingSVG(data);
    }
    if (macroDiaWidthLabel) {
      macroDiaWidthLabel.textContent = `← ${data.mm} Center Diamond Width →`;
    }
    if (macroCrownLabel) {
      macroCrownLabel.textContent = `Crown Height ~${data.crownHeight}`;
    }
    if (macroHallmarkLabel) {
      macroHallmarkLabel.textContent = `${metalName} • Beirut Atelier Hallmark`;
    }

    // Render View 2: On-Finger Scale View
    if (fingerRenderCanvas) {
      fingerRenderCanvas.innerHTML = renderFingerScaleSVG(data);
    }
    if (fingerCoverageGaugeVal) {
      fingerCoverageGaugeVal.textContent = `${data.fingerCoveragePercent}%`;
    }
    if (fingerCoverageGaugeBar) {
      fingerCoverageGaugeBar.style.width = `${data.fingerCoveragePercent}%`;
    }

    // Update View 3: Direct Carat Scale Selection State
    compareStoneItems.forEach(item => {
      item.classList.toggle('active', item.dataset.carat === state.selectedCarat);
    });
  }

  // Card Clicks
  ringCards.forEach(card => {
    card.addEventListener('click', (e) => {
      state.selectedCarat = e.currentTarget.dataset.carat;
      updateRingVisualizer();
    });
  });

  // Metal Pill Clicks
  metalPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      state.selectedRingMetal = e.currentTarget.dataset.metal;
      updateRingVisualizer();
    });
  });

  // View Switcher Tabs (Macro / Finger / Compare)
  stageViewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const viewMode = e.currentTarget.dataset.view;
      stageViewButtons.forEach(b => b.classList.toggle('active', b === e.currentTarget));

      const macroPanel = document.getElementById('view-macro-panel');
      const fingerPanel = document.getElementById('view-finger-panel');
      const comparePanel = document.getElementById('view-compare-panel');

      if (macroPanel) macroPanel.classList.toggle('active', viewMode === 'macro');
      if (fingerPanel) fingerPanel.classList.toggle('active', viewMode === 'finger');
      if (comparePanel) comparePanel.classList.toggle('active', viewMode === 'compare');
    });
  });

  // Compare Row Clickable Diamonds
  compareStoneItems.forEach(item => {
    item.addEventListener('click', (e) => {
      state.selectedCarat = e.currentTarget.dataset.carat;
      updateRingVisualizer();
    });
  });

  if (commissionSolitaireBtn) {
    commissionSolitaireBtn.addEventListener('click', () => {
      const data = CARAT_DATA[state.selectedCarat] || CARAT_DATA['1.00'];
      const metalName = state.selectedRingMetal === 'yellow' ? '18K Yellow Gold' : (state.selectedRingMetal === 'rose' ? '18K Rose Gold' : '18K White Gold / Platinum');
      closeAllModals();
      openWhatsAppInquiry(null, `I would like to commission a *${data.carat} (${data.mm})* Solitaire Engagement Ring in *${metalName}* from your Beirut workshop.`);
    });
  }

  // Initialize visualizer render on load
  updateRingVisualizer();

  // Bespoke Wedding Set Commission Form Submission -> WhatsApp
  const bespokeForm = document.getElementById('bespoke-form');
  if (bespokeForm) {
    bespokeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = bespokeForm.querySelector('input[type="text"]')?.value || 'Guest';
      const pieceType = bespokeForm.querySelector('select')?.value || 'Lebanese Wedding Set';
      closeAllModals();
      showToast('Redirecting to WhatsApp with your custom commission request...');

      const phone = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '96171063529';
      const text = `Hello Maison Aurum Concierge, my name is ${name}. I would like to consult with your master goldsmith regarding a custom commission for: *${pieceType}*. Please guide me on scheduling a private design session in Beirut or Kaslik.`;
      setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
      }, 500);
      bespokeForm.reset();
    });
  }

  // Appointment Form Submission -> WhatsApp
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = document.getElementById('appointment-city-select')?.value || 'Beirut - Downtown';
      closeAllModals();
      showToast('Redirecting to WhatsApp to confirm your private salon appointment...');

      const phone = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '96171063529';
      const text = `Hello Maison Aurum Concierge, I would like to reserve a private VIP viewing at your *${city}* salon. Please assist me with reserving my private consultation suite.`;
      setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
      }, 500);
      appointmentForm.reset();
    });
  }

  // Newsletter
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome to the Maison Aurum Private Circle.');
      newsletterForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // MOBILE NAVIGATION DRAWER & ACCORDIONS
  // -------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileCurrencySelect = document.getElementById('mobile-currency-select');
  const mobileDrawerSearchInput = document.getElementById('mobile-drawer-search-input');
  const mobileDrawerSearchResults = document.getElementById('mobile-drawer-search-results');

  function openMobileDrawer() {
    if (!mobileDrawer || !mobileDrawerBackdrop) return;
    mobileDrawer.classList.add('active');
    mobileDrawerBackdrop.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeMobileDrawer() {
    if (!mobileDrawer || !mobileDrawerBackdrop) return;
    mobileDrawer.classList.remove('active');
    mobileDrawerBackdrop.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileDrawer);
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  }

  if (mobileDrawerBackdrop) {
    mobileDrawerBackdrop.addEventListener('click', closeMobileDrawer);
  }

  // Accordion Dropdowns in Mobile Drawer
  document.querySelectorAll('.mobile-nav-heading').forEach(heading => {
    heading.addEventListener('click', () => {
      const targetId = `accordion-${heading.dataset.accordion}`;
      const collapse = document.getElementById(targetId);
      const isOpen = collapse && collapse.classList.contains('open');

      // Close all accordions first for clean accordion UX
      document.querySelectorAll('.mobile-nav-collapse').forEach(c => c.classList.remove('open'));
      document.querySelectorAll('.mobile-nav-heading').forEach(h => {
        h.classList.remove('active');
        h.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen && collapse) {
        collapse.classList.add('open');
        heading.classList.add('active');
        heading.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Universal Tab Navigation Links (Desktop Navbar, Mega Menu, Banners, Mobile Drawer, App Stories, Triptych Cards)
  document.querySelectorAll('a[data-tab], button[data-tab], .app-story-item[data-tab], .triptych-card[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      // Prevent double trigger if clicking a nested child element that has its own data-tab
      if (link.classList.contains('triptych-card') && e.target.closest('a[data-tab], button[data-tab]') && e.target.closest('a[data-tab], button[data-tab]') !== link) {
        return;
      }
      const tab = link.dataset.tab;
      if (tab) {
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        state.currentTab = tab;
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
        renderProducts();

        // Highlight active story capsule if tapped
        if (link.classList.contains('app-story-item') || link.closest('.app-story-item')) {
          document.querySelectorAll('.app-story-ring').forEach(r => r.classList.remove('active-ring'));
          const ring = link.querySelector('.app-story-ring') || link.closest('.app-story-item').querySelector('.app-story-ring');
          if (ring) ring.classList.add('active-ring');
        }

        const showcase = document.getElementById('products-showcase');
        if (showcase) {
          showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Highlight catalog tab in mobile bottom bar
        const bbarShop = document.getElementById('bbar-shop');
        if (bbarShop) {
          document.querySelectorAll('.bottom-bar-item').forEach(i => i.classList.remove('active'));
          bbarShop.classList.add('active');
        }
      }
      if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
      if (typeof closeMobileSearch === 'function') closeMobileSearch();
    });

    if (link.classList.contains('triptych-card')) {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });

  // Mobile Drawer Currency Selector Sync
  if (mobileCurrencySelect) {
    mobileCurrencySelect.value = state.currentCurrency;
    mobileCurrencySelect.addEventListener('change', (e) => {
      handleCurrencyChange(e.target.value);
      if (currencySelect) currencySelect.value = e.target.value;
    });
  }

  // Mobile Drawer Search
  if (mobileDrawerSearchInput && mobileDrawerSearchResults) {
    mobileDrawerSearchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length >= 2) {
        const matches = searchCatalog(val).slice(0, 5);

        if (matches.length > 0) {
          mobileDrawerSearchResults.innerHTML = matches.map(p => `
            <div class="search-result-item" data-id="${p.id}">
              <img class="search-result-thumb" src="${p.image}" alt="${p.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'">
              <div class="search-result-info">
                <div class="search-result-title">${p.title}</div>
                <div class="search-result-meta">${formatPrice(p.priceUSD)} • ${p.category}</div>
              </div>
            </div>
          `).join('');
          mobileDrawerSearchResults.classList.add('active');

          mobileDrawerSearchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
              openQuickView(item.dataset.id);
              closeMobileDrawer();
              mobileDrawerSearchResults.classList.remove('active');
            });
          });
        } else {
          mobileDrawerSearchResults.innerHTML = `<div style="padding: 10px; font-size: 0.8rem; color: var(--text-muted); text-align: center;">No pieces found</div>`;
          mobileDrawerSearchResults.classList.add('active');
        }
      } else {
        mobileDrawerSearchResults.classList.remove('active');
      }
    });

    mobileDrawerSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = mobileDrawerSearchInput.value.trim();
        state.searchQuery = val;
        state.currentTab = 'all';
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'all'));
        renderProducts();
        closeMobileDrawer();
        const showcase = document.getElementById('products-showcase');
        if (showcase) {
          showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // MOBILE SEARCH OVERLAY MODAL
  // -------------------------------------------------------------------------
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const bbarSearchBtn = document.getElementById('bbar-search');
  const mobileSearchModal = document.getElementById('mobile-search-modal');
  const mobileSearchCancelBtn = document.getElementById('mobile-search-cancel-btn');
  const mobileSearchClearBtn = document.getElementById('mobile-search-clear-btn');
  const mobileOverlaySearchInput = document.getElementById('mobile-overlay-search-input');
  const mobileSearchResultsList = document.getElementById('mobile-search-results-list');

  function openMobileSearch() {
    if (!mobileSearchModal) return;
    mobileSearchModal.classList.add('active');
    document.body.classList.add('no-scroll');
    setTimeout(() => {
      if (mobileOverlaySearchInput) mobileOverlaySearchInput.focus();
    }, 200);
  }

  function closeMobileSearch() {
    if (!mobileSearchModal) return;
    mobileSearchModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    if (mobileOverlaySearchInput) mobileOverlaySearchInput.value = '';
    if (mobileSearchResultsList) mobileSearchResultsList.innerHTML = '';
    if (mobileSearchClearBtn) mobileSearchClearBtn.classList.remove('active');
  }

  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', openMobileSearch);
  }

  if (bbarSearchBtn) {
    bbarSearchBtn.addEventListener('click', openMobileSearch);
  }

  if (mobileSearchCancelBtn) {
    mobileSearchCancelBtn.addEventListener('click', closeMobileSearch);
  }

  if (mobileSearchClearBtn) {
    mobileSearchClearBtn.addEventListener('click', () => {
      if (mobileOverlaySearchInput) {
        mobileOverlaySearchInput.value = '';
        mobileOverlaySearchInput.focus();
      }
      if (mobileSearchResultsList) mobileSearchResultsList.innerHTML = '';
      mobileSearchClearBtn.classList.remove('active');
    });
  }

  // Live Autocomplete for Mobile Search Overlay
  if (mobileOverlaySearchInput && mobileSearchResultsList) {
    mobileOverlaySearchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (mobileSearchClearBtn) {
        mobileSearchClearBtn.classList.toggle('active', val.length > 0);
      }

      if (val.length >= 2) {
        const matches = searchCatalog(val);

        if (matches.length > 0) {
          mobileSearchResultsList.innerHTML = `
            <div style="font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
              ${matches.length} Creations Found
            </div>
            ${matches.map(p => `
              <div class="search-result-item" data-id="${p.id}">
                <img class="search-result-thumb" src="${p.image}" alt="${p.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'">
                <div class="search-result-info">
                  <div class="search-result-title">${p.title}</div>
                  <div class="search-result-meta">${formatPrice(p.priceUSD)} • ${p.category} (${p.metal})</div>
                </div>
              </div>
            `).join('')}
          `;

          mobileSearchResultsList.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
              openQuickView(item.dataset.id);
              closeMobileSearch();
            });
          });
        } else {
          mobileSearchResultsList.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 10px; color: var(--gold-primary);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <p style="font-size: 0.95rem; color: var(--text-primary); font-family: var(--font-serif); margin-bottom: 4px;">No creations matching "${val}"</p>
              <p style="font-size: 0.8rem;">Try searching for Rings, Necklaces, Bracelets, Solitaires, or 18KT Gold.</p>
            </div>
          `;
        }
      } else {
        mobileSearchResultsList.innerHTML = '';
      }
    });

    mobileOverlaySearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = mobileOverlaySearchInput.value.trim();
        state.searchQuery = val;
        state.currentTab = 'all';
        renderProducts();
        closeMobileSearch();
        const showcase = document.getElementById('products-showcase');
        if (showcase) {
          showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // Popular Search Tag Buttons
  document.querySelectorAll('.mobile-search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.dataset.query;
      if (mobileOverlaySearchInput) {
        mobileOverlaySearchInput.value = q;
        mobileOverlaySearchInput.dispatchEvent(new Event('input'));
      }
    });
  });

  // -------------------------------------------------------------------------
  // MOBILE STICKY BOTTOM NAVIGATION BAR CONTROLLER
  // -------------------------------------------------------------------------
  const bbarHome = document.getElementById('bbar-home');
  const bbarShop = document.getElementById('bbar-shop');
  const bbarWishlist = document.getElementById('bbar-wishlist');
  const bbarCart = document.getElementById('bbar-cart');

  if (bbarHome) {
    bbarHome.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelectorAll('.bottom-bar-item').forEach(i => i.classList.remove('active'));
      bbarHome.classList.add('active');
    });
  }

  if (bbarShop) {
    bbarShop.addEventListener('click', (e) => {
      e.preventDefault();
      const showcase = document.getElementById('products-showcase');
      if (showcase) {
        showcase.scrollIntoView({ behavior: 'smooth' });
      }
      document.querySelectorAll('.bottom-bar-item').forEach(i => i.classList.remove('active'));
      bbarShop.classList.add('active');
    });
  }

  if (bbarWishlist) {
    bbarWishlist.addEventListener('click', () => {
      openDrawer('wishlist');
    });
  }

  if (bbarCart) {
    bbarCart.addEventListener('click', () => {
      openDrawer('cart');
    });
  }

  // Scroll spy to update active item in mobile bottom bar
  const showcaseSec = document.getElementById('products-showcase');
  if (showcaseSec && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (bbarShop) {
            document.querySelectorAll('.bottom-bar-item').forEach(i => i.classList.remove('active'));
            bbarShop.classList.add('active');
          }
        } else {
          if (window.scrollY < 300 && bbarHome) {
            document.querySelectorAll('.bottom-bar-item').forEach(i => i.classList.remove('active'));
            bbarHome.classList.add('active');
          }
        }
      });
    }, { threshold: 0.2 });
    observer.observe(showcaseSec);
  }
  // PRODUCT GRID VIEW MODE TOGGLE (2-Col vs 1-Col)
  // -------------------------------------------------------------------------
  const viewModeButtons = document.querySelectorAll('#view-mode-toggle .view-btn');
  if (viewModeButtons.length > 0 && productGrid) {
    viewModeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        viewModeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (mode === '1col') {
          productGrid.classList.add('view-1col');
        } else {
          productGrid.classList.remove('view-1col');
        }
      });
    });
  }

  // Close Mobile Overlays & Drawers on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileDrawer();
      closeMobileSearch();
    }
  });

  // -------------------------------------------------------------------------
  // Toast Notifications
  // -------------------------------------------------------------------------
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B89358" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Initial renders
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  updateRingVisualizer();
});
