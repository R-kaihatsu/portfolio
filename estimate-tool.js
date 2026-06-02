(() => {
  const tool = document.querySelector("[data-estimate-tool]");
  if (!tool) return;

  const state = {
    plan: null,
    extraPages: 0,
    material: null,
  };

  const prices = {
    maintenance: { base: 58000, monthly: 6970 },
    once: { base: 120000, monthly: 0 },
    page: 10000,
    materialSupport: 20000,
  };

  const steps = [...tool.querySelectorAll("[data-step]")];
  const progress = tool.querySelector("[data-progress]");
  const pageCounter = tool.querySelector("[data-page-counter]");
  const pageCount = tool.querySelector("[data-page-count]");
  const resultButton = tool.querySelector("[data-show-result]");
  const result = tool.querySelector("[data-result]");
  const yen = new Intl.NumberFormat("ja-JP");

  const formatYen = (amount) => `${yen.format(amount)}円（税別）`;

  const showStep = (stepNumber) => {
    steps.forEach((step) => {
      step.classList.toggle("is-active", step.dataset.step === String(stepNumber));
    });
    progress.style.width = `${(stepNumber / steps.length) * 100}%`;
    steps[stepNumber - 1].scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hideResult = () => {
    result.hidden = true;
    result.classList.remove("is-revealed");
  };

  const selectCard = (selector, value) => {
    tool.querySelectorAll(selector).forEach((button) => {
      const isSelected =
        button.dataset.plan === value ||
        button.dataset.pages === value ||
        button.dataset.material === value;
      button.classList.toggle("is-selected", isSelected);
    });
  };

  const updatePageCount = () => {
    pageCount.textContent = state.extraPages;
  };

  const renderResult = () => {
    const plan = prices[state.plan];
    const pageCost = state.extraPages * prices.page;
    const materialCost = state.material === "support" ? prices.materialSupport : 0;
    const total = plan.base + pageCost + materialCost;

    tool.querySelector("[data-result-base]").textContent = formatYen(plan.base);
    tool.querySelector("[data-result-pages]").textContent = formatYen(pageCost);
    tool.querySelector("[data-result-material]").textContent = formatYen(materialCost);
    tool.querySelector("[data-result-monthly]").textContent =
      state.plan === "maintenance" ? `月額 ${formatYen(plan.monthly)}` : formatYen(0);
    tool.querySelector("[data-result-total]").textContent = formatYen(total);

    const maintenanceText =
      state.plan === "maintenance"
        ? "保守費用: 月額 6,970円（税別） ※お得な一括年払い（69,700円 / 実質2ヶ月無料）もご用意しております"
        : "保守費用: 0円（税別）";
    tool.querySelector("[data-result-maintenance]").textContent = maintenanceText;

    result.hidden = false;
    result.classList.remove("is-revealed");
    void result.offsetWidth;
    requestAnimationFrame(() => {
      result.classList.add("is-revealed");
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  tool.addEventListener("click", (event) => {
    const planButton = event.target.closest("[data-plan]");
    if (planButton) {
      state.plan = planButton.dataset.plan;
      selectCard("[data-plan]", state.plan);
      hideResult();
      window.setTimeout(() => showStep(2), 220);
      return;
    }

    const pagesButton = event.target.closest("[data-pages]");
    if (pagesButton) {
      const pageMode = pagesButton.dataset.pages;
      selectCard("[data-pages]", pageMode);
      hideResult();

      if (pageMode === "none") {
        state.extraPages = 0;
        pageCounter.hidden = true;
        window.setTimeout(() => showStep(3), 220);
      } else {
        state.extraPages = Math.max(state.extraPages, 1);
        updatePageCount();
        pageCounter.hidden = false;
        pageCounter.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (event.target.closest("[data-page-dec]")) {
      state.extraPages = Math.max(1, state.extraPages - 1);
      updatePageCount();
      hideResult();
      return;
    }

    if (event.target.closest("[data-page-inc]")) {
      state.extraPages = Math.min(20, state.extraPages + 1);
      updatePageCount();
      hideResult();
      return;
    }

    if (event.target.closest("[data-page-next]")) {
      showStep(3);
      return;
    }

    const materialButton = event.target.closest("[data-material]");
    if (materialButton) {
      state.material = materialButton.dataset.material;
      selectCard("[data-material]", state.material);
      resultButton.disabled = false;
      hideResult();
      return;
    }

    if (event.target.closest("[data-show-result]")) {
      if (!state.plan || state.material === null) return;
      renderResult();
    }
  });
})();
