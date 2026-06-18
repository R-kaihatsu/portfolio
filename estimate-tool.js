(() => {
  const tool = document.querySelector("[data-estimate-tool]");
  if (!tool) return;

  const planSelect = tool.querySelector("[data-estimate-plan]");
  const pageSelect = tool.querySelector("[data-estimate-pages]");
  const materialCheck = tool.querySelector("[data-estimate-material]");
  const totalOutput = tool.querySelector("[data-estimate-total]");
  const monthlyOutput = tool.querySelector("[data-estimate-monthly]");
  const yen = new Intl.NumberFormat("ja-JP");

  const prices = {
    maintenance: {
      base: 58000,
      monthly: 6980,
    },
    once: {
      base: 120000,
      monthly: 0,
    },
    page: 10000,
    material: 20000,
  };

  const render = () => {
    const plan = prices[planSelect.value];
    const extraPages = Number(pageSelect.value);
    const material = materialCheck.checked ? prices.material : 0;
    const total = plan.base + extraPages * prices.page + material;

    totalOutput.textContent = `${yen.format(total)}円`;
    monthlyOutput.textContent =
      plan.monthly > 0 ? `保守費用 月額${yen.format(plan.monthly)}円` : "月額費用なし";
  };

  [planSelect, pageSelect, materialCheck].forEach((control) => {
    control.addEventListener("change", render);
  });

  render();
})();
