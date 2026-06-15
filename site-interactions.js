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