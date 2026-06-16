(() => {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const yen = new Intl.NumberFormat("ja-JP");
  const formatTaxExcluded = (amount) => `${yen.format(amount)}円（税別）`;

  const getHeaderHeight = () => {
    const header = document.querySelector(".site-header");
    return header ? header.getBoundingClientRect().height : 0;
  };

  const highlightTarget = (target) => {
    target.classList.remove("is-plan-highlighted");
    window.requestAnimationFrame(() => {
      target.classList.add("is-plan-highlighted");
      window.setTimeout(() => {
        target.classList.remove("is-plan-highlighted");
      }, reducedMotionQuery.matches ? 900 : 1800);
    });
  };

  document.querySelectorAll("[data-plan-jump]").forEach((card) => {
    card.addEventListener("click", (event) => {
      const selector = card.getAttribute("data-plan-jump") || card.getAttribute("href");
      const target = selector ? document.querySelector(selector) : null;

      if (!target) {
        return;
      }

      event.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - getHeaderHeight();
      window.scrollTo({
        top,
        behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      });

      if (window.history && selector.startsWith("#")) {
        window.history.pushState(null, "", selector);
      }

      window.setTimeout(() => highlightTarget(target), reducedMotionQuery.matches ? 0 : 520);
    });
  });

  document.querySelectorAll("[data-pricing-tabs]").forEach((tabRoot) => {
    const tabs = [...tabRoot.querySelectorAll("[data-pricing-tab]")];
    const panels = [...tabRoot.querySelectorAll("[data-pricing-panel]")];
    const hashToTab = {
      "#diagnosis": "diagnosis",
      "#web-production": "production",
      "#maintenance": "maintenance",
      "#estimate": "estimate",
      "#estimate-area": "estimate",
    };

    const activateTab = (key, shouldFocus = false) => {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.pricingTab === key;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive && shouldFocus) {
          tab.focus({ preventScroll: true });
        }
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.pricingPanel === key;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    };

    const initialKey = hashToTab[window.location.hash];
    if (initialKey) {
      activateTab(initialKey);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        activateTab(tab.dataset.pricingTab);
      });

      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          return;
        }

        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;

        activateTab(tabs[nextIndex].dataset.pricingTab, true);
      });
    });
  });

  document.querySelectorAll("[data-estimate-switch]").forEach((switcher) => {
    const container = switcher.closest(".pricing-estimate");
    const buttons = [...switcher.querySelectorAll("[data-estimate-mode]")];
    const panels = container ? [...container.querySelectorAll("[data-estimate-mode-panel]")] : [];

    const activateMode = (mode) => {
      buttons.forEach((button) => {
        const isActive = button.dataset.estimateMode === mode;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.estimateModePanel === mode;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => activateMode(button.dataset.estimateMode));
    });
  });

  document.querySelectorAll("[data-diagnosis-estimate]").forEach((tool) => {
    const state = {
      site: "yes",
      scope: "top",
      repair: "no",
      support: "no",
    };

    const scopePrices = {
      top: 0,
      few: 5000,
      full: 10000,
    };

    const scopeLabels = {
      top: "トップページのみ",
      few: "数ページ",
      full: "サイト全体",
    };

    const setSelected = (selector, attribute, value) => {
      tool.querySelectorAll(selector).forEach((button) => {
        button.classList.toggle("is-selected", button.getAttribute(attribute) === value);
      });
    };

    const hideResult = () => {
      const result = tool.querySelector("[data-diagnosis-result]");
      if (result) {
        result.hidden = true;
        result.classList.remove("is-revealed");
      }
    };

    const getSelectedImprovements = () =>
      [...tool.querySelectorAll("[data-diagnosis-improvement]:checked")].map((input) => input.value);

    const renderResult = () => {
      const improvements = getSelectedImprovements();
      const hasFormWork = improvements.includes("問い合わせフォーム");
      const base = state.site === "yes" ? scopePrices[state.scope] : 58000;
      let repairCost = 0;

      if (state.site === "yes" && state.repair === "yes") {
        repairCost = Math.max(10000, improvements.length * 5000);
        if (hasFormWork) {
          repairCost += 15000;
        }
      }

      const supportMonthly = state.support === "yes" ? 6980 : 0;
      const total = base + repairCost;
      const result = tool.querySelector("[data-diagnosis-result]");
      const note = tool.querySelector("[data-diagnosis-result-note]");

      tool.querySelector("[data-diagnosis-result-base]").textContent = formatTaxExcluded(base);
      tool.querySelector("[data-diagnosis-result-repair]").textContent = formatTaxExcluded(repairCost);
      tool.querySelector("[data-diagnosis-result-support]").textContent =
        supportMonthly > 0 ? `月額 ${formatTaxExcluded(supportMonthly)}` : formatTaxExcluded(0);
      tool.querySelector("[data-diagnosis-result-total]").textContent = formatTaxExcluded(total);

      if (state.site === "no") {
        note.textContent = "現在ホームページがない場合は、新規Web制作の最小構成として保守セットプラン 58,000円（税別）からの目安で表示しています。";
      } else if (state.repair === "yes") {
        const targetText = improvements.length > 0 ? improvements.join("・") : "軽微な修正";
        note.textContent = `${scopeLabels[state.scope]}の診断に加えて、${targetText}の修正相談を含めた概算です。`;
      } else {
        note.textContent = `${scopeLabels[state.scope]}の診断費用の目安です。修正作業は内容を確認してから必要な分だけご提案します。`;
      }

      result.hidden = false;
      result.classList.remove("is-revealed");
      void result.offsetWidth;
      window.requestAnimationFrame(() => {
        result.classList.add("is-revealed");
        result.scrollIntoView({
          behavior: reducedMotionQuery.matches ? "auto" : "smooth",
          block: "nearest",
        });
      });
    };

    tool.addEventListener("click", (event) => {
      const siteButton = event.target.closest("[data-diagnosis-site]");
      if (siteButton) {
        state.site = siteButton.dataset.diagnosisSite;
        setSelected("[data-diagnosis-site]", "data-diagnosis-site", state.site);
        hideResult();
        return;
      }

      const scopeButton = event.target.closest("[data-diagnosis-scope]");
      if (scopeButton) {
        state.scope = scopeButton.dataset.diagnosisScope;
        setSelected("[data-diagnosis-scope]", "data-diagnosis-scope", state.scope);
        hideResult();
        return;
      }

      const repairButton = event.target.closest("[data-diagnosis-repair]");
      if (repairButton) {
        state.repair = repairButton.dataset.diagnosisRepair;
        setSelected("[data-diagnosis-repair]", "data-diagnosis-repair", state.repair);
        hideResult();
        return;
      }

      const supportButton = event.target.closest("[data-diagnosis-support]");
      if (supportButton) {
        state.support = supportButton.dataset.diagnosisSupport;
        setSelected("[data-diagnosis-support]", "data-diagnosis-support", state.support);
        hideResult();
        return;
      }

      if (event.target.closest("[data-diagnosis-show-result]")) {
        renderResult();
      }
    });

    tool.addEventListener("change", (event) => {
      if (event.target.matches("[data-diagnosis-improvement]")) {
        hideResult();
      }
    });
  });

  document.querySelectorAll("[data-improvement-slider]").forEach((slider) => {
    const range = slider.querySelector("[data-improvement-range]");

    if (!range) {
      return;
    }

    const updateSlider = () => {
      const value = Number(range.value);
      slider.style.setProperty("--compare-position", `${value}%`);
      slider.dataset.compareState = value < 42 ? "before" : value > 58 ? "after" : "balanced";
    };

    range.addEventListener("input", updateSlider);
    updateSlider();
  });
})();