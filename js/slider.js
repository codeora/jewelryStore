/**
 * Maison Aurum — Split Editorial Hero Slider
 * Haute Joaillerie editorial stage with focal creation spotlight,
 * timeline pagination, smooth crossfades, and touch swipe.
 */

class HeroSlider {
  constructor(containerId, slidesData) {
    this.container = document.getElementById(containerId);
    this.slidesData = slidesData;
    this.currentIndex = 0;
    this.timer = null;
    this.interval = 6500;
    this.touchStartX = 0;
    this.touchEndX = 0;

    if (!this.container) return;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.startAutoplay();
  }

  render() {
    const total = this.slidesData.length;
    this.container.innerHTML = `
      <div class="hero-slider-container">
        ${this.slidesData.map((slide, idx) => `
          <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
            <img class="hero-bg-img" src="${slide.image}" alt="Maison Aurum Haute Joaillerie" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=85'">
            <div class="hero-overlay"></div>
            
            <div class="container hero-inner-container">
              <div class="hero-split-grid">
                <!-- Left: Haute Editorial Column -->
                <div class="hero-content">
                  <div class="hero-eyebrow-row">
                    <span class="hero-roman-index">COLLECTION ${slide.num || ('0' + (idx + 1))}</span>
                    <span class="hero-eyebrow-sep">♦</span>
                    <span class="hero-eyebrow">${slide.eyebrow}</span>
                  </div>
                  
                  <h1 class="hero-title">${slide.title}</h1>
                  <p class="hero-subtitle">${slide.subtitle}</p>
                  
                  <div class="hero-actions">
                    <a href="${slide.ctaLink}" class="btn-luxury hero-btn-main">
                      <span>${slide.ctaText}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                    <a href="#bespoke-section" class="btn-hero-ghost">
                      <span>Atelier Commissions</span>
                    </a>
                  </div>
                </div>

                <!-- Right: Focal Jewel Spotlight Card (Bespoke Haute Joaillerie) -->
                <div class="hero-spotlight-col">
                  <div class="hero-focal-card" data-focal-id="${slide.focalId || ''}">
                    <div class="focal-card-badge">
                      <span class="focal-badge-pip"></span>
                      <span>${slide.focalTag || 'Atelier Masterpiece'}</span>
                    </div>
                    <div class="focal-image-wrap">
                      <img src="${slide.focalImage || slide.image}" alt="${slide.focalTitle || 'Haute Joaillerie'}" class="focal-img" loading="eager">
                      <div class="focal-shimmer"></div>
                    </div>
                    <div class="focal-details">
                      <div class="focal-collection-tag">Atelier Beirut • 18KT & Diamonds</div>
                      <h4 class="focal-title">${slide.focalTitle || 'The Beirut Solitaire'}</h4>
                      <p class="focal-spec">${slide.focalSpec || 'Triple Excellent Cut • GIA Certified'}</p>
                      <div class="focal-footer">
                        <span class="focal-price">${slide.focalPrice || ''}</span>
                        <button class="focal-view-btn" data-id="${slide.focalId || 'sal-001'}" type="button">
                          <span>Examine Creation</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- Modern Architectural Timeline Indicator & Controls -->
        <div class="hero-timeline-bar">
          <div class="container hero-timeline-inner">
            <div class="hero-timeline-items">
              ${this.slidesData.map((slide, idx) => `
                <button class="hero-timeline-step ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Slide ${idx + 1}">
                  <span class="step-num">${slide.num || ('0' + (idx + 1))}</span>
                  <span class="step-label">${slide.focalTag ? slide.focalTag.split(' ')[0] : 'Creation'}</span>
                  <span class="step-line"><span class="step-progress"></span></span>
                </button>
              `).join('')}
            </div>
            
            <div class="hero-nav-arrows">
              <button class="hero-nav-btn prev" aria-label="Previous Slide">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <span class="hero-counter-display">
                <span class="curr-num">01</span> / <span class="total-num">0${total}</span>
              </span>
              <button class="hero-nav-btn next" aria-label="Next Slide">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.slides = this.container.querySelectorAll('.hero-slide');
    this.timelineSteps = this.container.querySelectorAll('.hero-timeline-step');
    this.currNumEl = this.container.querySelector('.curr-num');
  }

  bindEvents() {
    const prevBtn = this.container.querySelector('.hero-nav-btn.prev');
    const nextBtn = this.container.querySelector('.hero-nav-btn.next');

    if (prevBtn) prevBtn.addEventListener('click', () => { this.prev(); this.restartAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { this.next(); this.restartAutoplay(); });

    this.timelineSteps.forEach(step => {
      step.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const idx = parseInt(target.dataset.index, 10);
        this.goTo(idx);
        this.restartAutoplay();
      });
    });

    // Delegate click on Examine Creation focal buttons to open Quick View if available
    this.container.querySelectorAll('.focal-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = btn.dataset.id;
        if (typeof window.openQuickView === 'function') {
          window.openQuickView(prodId);
        } else {
          const targetCard = document.querySelector(`.product-card[data-id="${prodId}"]`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.hash = 'products-showcase';
          }
        }
      });
    });

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());

    // Touch events for mobile swiping
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
      this.restartAutoplay();
    }
  }

  goTo(index) {
    if (index === this.currentIndex) return;
    this.slides[this.currentIndex].classList.remove('active');
    this.timelineSteps[this.currentIndex].classList.remove('active');

    this.currentIndex = (index + this.slidesData.length) % this.slidesData.length;

    this.slides[this.currentIndex].classList.add('active');
    this.timelineSteps[this.currentIndex].classList.add('active');

    if (this.currNumEl) {
      this.currNumEl.textContent = '0' + (this.currentIndex + 1);
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  startAutoplay() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
