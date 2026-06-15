(() => {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const getHeaderHeight = () => {
    const header = document.querySelector('.site-header');
    return header ? header.getBoundingClientRect().height : 0;
  };

  const highlightTarget = (target) => {
    target.classList.remove('is-plan-highlighted');
    window.requestAnimationFrame(() => {
      target.classList.add('is-plan-highlighted');
      window.setTimeout(() => {
        target.classList.remove('is-plan-highlighted');
      }, reducedMotionQuery.matches ? 900 : 1800);
    });
  };

  document.querySelectorAll('[data-plan-jump]').forEach((card) => {
    card.addEventListener('click', (event) => {
      const selector = card.getAttribute('data-plan-jump') || card.getAttribute('href');
      const target = selector ? document.querySelector(selector) : null;

      if (!target) {
        return;
      }

      event.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - getHeaderHeight();
      window.scrollTo({
        top,
        behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
      });

      if (window.history && selector.startsWith('#')) {
        window.history.pushState(null, '', selector);
      }

      window.setTimeout(() => highlightTarget(target), reducedMotionQuery.matches ? 0 : 520);
    });
  });

  const pricingTabs = [...document.querySelectorAll('[data-pricing-tab]')];
  const pricingPanels = [...document.querySelectorAll('[data-pricing-panel]')];

  if (pricingTabs.length && pricingPanels.length) {
    const activatePricingTab = (key) => {
      pricingTabs.forEach((tab) => {
        const isActive = tab.dataset.pricingTab === key;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      pricingPanels.forEach((panel) => {
        const isActive = panel.dataset.pricingPanel === key;
        panel.hidden = !isActive;
        panel.classList.toggle('is-active', isActive);
      });
    };

    const hashToTab = {
      '#diagnosis': 'diagnosis',
      '#web-production': 'web-production',
      '#maintenance': 'maintenance',
    };

    pricingTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        activatePricingTab(tab.dataset.pricingTab);
      });

      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          return;
        }

        event.preventDefault();
        const lastIndex = pricingTabs.length - 1;
        let nextIndex = index;

        if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1;
        if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = lastIndex;

        pricingTabs[nextIndex].focus();
        activatePricingTab(pricingTabs[nextIndex].dataset.pricingTab);
      });
    });

    if (hashToTab[window.location.hash]) {
      activatePricingTab(hashToTab[window.location.hash]);
    } else {
      const activeTab = pricingTabs.find((tab) => tab.classList.contains('is-active')) || pricingTabs[0];
      activatePricingTab(activeTab.dataset.pricingTab);
    }

    window.addEventListener('hashchange', () => {
      if (hashToTab[window.location.hash]) {
        activatePricingTab(hashToTab[window.location.hash]);
      }
    });
  }
  document.querySelectorAll('[data-improvement-slider]').forEach((slider) => {
    const range = slider.querySelector('[data-improvement-range]');

    if (!range) {
      return;
    }

    const updateSlider = () => {
      const value = Number(range.value);
      slider.style.setProperty('--compare-position', `${value}%`);
      slider.dataset.compareState = value < 42 ? 'before' : value > 58 ? 'after' : 'balanced';
    };

    range.addEventListener('input', updateSlider);
    updateSlider();
  });
})();