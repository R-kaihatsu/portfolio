(() => {
  const yen = new Intl.NumberFormat("ja-JP");

  const PRICING_DATA = {
    plans: {
      maintenance: {
        label: "保守セットプラン",
        price: 58000,
        priceLabel: "58,000円（税別）",
        note: "基本5ページ・月額保守契約が前提",
      },
      once: {
        label: "買い切り制作プラン",
        price: 120000,
        priceLabel: "120,000円（税別）",
        note: "基本5ページ・月額費用なし",
      },
    },
    pages: {
      0: { label: "追加なし", price: 0, priceLabel: "0円" },
      1: { label: "1ページ", price: 10000, priceLabel: "+10,000円" },
      2: { label: "2ページ", price: 20000, priceLabel: "+20,000円" },
      3: { label: "3ページ", price: 30000, priceLabel: "+30,000円" },
      4: { label: "4ページ", price: 40000, priceLabel: "+40,000円" },
      5: { label: "5ページ", price: 50000, priceLabel: "+50,000円" },
    },
    materials: {
      self: {
        label: "写真・文章を自分で用意",
        price: 0,
        priceLabel: "0円",
        note: "追加サポートなし",
        reset: true,
      },
      organize: {
        label: "写真選定・文章整理",
        price: 20000,
        priceLabel: "+20,000円（税別）",
        note: "掲載素材を一緒に整理",
      },
      writing: {
        label: "文章作成をしっかり依頼",
        price: 30000,
        priceLabel: "+30,000円〜（税別）",
        note: "内容量により変動",
        minimum: true,
      },
      image: {
        label: "ロゴ・画像の簡易加工",
        price: 10000,
        priceLabel: "+10,000円〜（税別）",
        note: "加工点数により変動",
        minimum: true,
      },
    },
    features: {
      none: {
        label: "機能追加なし",
        price: 0,
        priceLabel: "0円",
        note: "基本構成のみ",
        reset: true,
        detail: false,
      },
      form: {
        label: "お問い合わせフォーム",
        price: 20000,
        priceLabel: "+20,000円（税別）",
      },
      booking: {
        label: "予約システム導入",
        price: 30000,
        priceLabel: "+30,000円〜（税別）",
        minimum: true,
      },
      ec: {
        label: "EC機能導入",
        price: 50000,
        priceLabel: "+50,000円〜（税別）",
        minimum: true,
      },
      map: {
        label: "Googleマップ埋め込み",
        price: 5000,
        priceLabel: "+5,000円（税別）",
      },
      social: {
        label: "SNSリンク・Instagram埋め込み",
        price: 5000,
        priceLabel: "+5,000円（税別）",
      },
      news: {
        label: "お知らせ更新風セクション",
        price: 10000,
        priceLabel: "+10,000円〜（税別）",
        minimum: true,
      },
    },
    siteTypes: {
      new: {
        label: "新規制作",
        price: 0,
        priceLabel: "追加費用 0円",
        note: "基本プランの制作費で計算",
      },
      renewal: {
        label: "既存サイトのリニューアル",
        price: 30000,
        priceLabel: "+30,000円〜（税別）",
        note: "既存データの確認・移行を含む目安",
        minimum: true,
      },
      partial: {
        label: "一部ページだけ修正",
        price: 10000,
        priceLabel: "+10,000円〜（税別）",
        note: "基本プラン費を除き、修正費の目安で計算",
        minimum: true,
      },
      diagnosis: {
        label: "まずは改善診断のみ",
        price: 5000,
        priceLabel: "5,000円（税別）",
        note: "制作・追加機能は合計に含めません",
      },
    },
    maintenance: {
      none: {
        label: "保守なし",
        price: 0,
        priceLabel: "月額 0円",
        note: "保守セット選択時は買い切りへ変更",
      },
      light: {
        label: "ライト",
        price: 6980,
        priceLabel: "月額 6,980円（税込）",
        note: "状態確認・軽微な相談",
      },
      standard: {
        label: "スタンダード",
        price: 9800,
        priceLabel: "月額 9,800円（税込）",
        note: "お知らせ・画像等の更新",
      },
      premium: {
        label: "プレミアム",
        price: 14800,
        priceLabel: "月額 14,800円（税込）",
        note: "更新・軽微な修正まで手厚く対応",
      },
    },
  };

  const formatYen = (amount) => `${yen.format(amount)}円`;

  const renderPriceDetails = () => {
    const container = document.querySelector("[data-price-details]");
    if (!container) return;

    const groups = [
      {
        title: "基本制作",
        eyebrow: "Base plans",
        rows: [
          {
            label: PRICING_DATA.plans.maintenance.label,
            price: PRICING_DATA.plans.maintenance.priceLabel,
            note: "月額保守 6,980円（税込）〜",
          },
          {
            label: PRICING_DATA.plans.once.label,
            price: PRICING_DATA.plans.once.priceLabel,
            note: "月額 0円",
          },
        ],
      },
      {
        title: "ページ・素材",
        eyebrow: "Content",
        rows: [
          {
            label: "6ページ目以降",
            price: "+10,000円 / 1ページ（税別）",
            note: "基本プランは5ページまで",
          },
          ...Object.values(PRICING_DATA.materials).map((item) => ({
            label: item.label,
            price: item.priceLabel,
            note: item.note,
          })),
        ],
      },
      {
        title: "機能追加",
        eyebrow: "Features",
        rows: Object.values(PRICING_DATA.features)
          .filter((item) => item.detail !== false)
          .map((item) => ({
            label: item.label,
            price: item.priceLabel,
            note: item.note,
          })),
      },
      {
        title: "既存サイト対応",
        eyebrow: "Existing site",
        rows: Object.values(PRICING_DATA.siteTypes).map((item) => ({
          label: item.label,
          price: item.priceLabel,
          note: item.note,
        })),
      },
      {
        title: "保守プラン",
        eyebrow: "Maintenance",
        rows: Object.values(PRICING_DATA.maintenance).map((item) => ({
          label: item.label,
          price: item.priceLabel,
          note: item.note,
        })),
      },
    ];

    container.innerHTML = groups
      .map(
        (group) => `
          <article class="rate-card">
            <div class="rate-card__header">
              <h4>${group.title}</h4>
              <span>${group.eyebrow}</span>
            </div>
            <dl class="rate-list">
              ${group.rows
                .map(
                  (row) => `
                    <div>
                      <dt>${row.label}</dt>
                      <dd>${row.price}</dd>
                      ${row.note ? `<small>${row.note}</small>` : ""}
                    </div>
                  `,
                )
                .join("")}
            </dl>
          </article>
        `,
      )
      .join("");
  };

  renderPriceDetails();

  const tool = document.querySelector("[data-estimate-tool]");
  if (!tool) return;

  const state = {
    plan: "maintenance",
    pages: "0",
    materials: new Set(),
    features: new Set(),
    siteType: "new",
    maintenance: "light",
  };

  const multipleGroups = new Set(["materials", "features"]);

  const isSelected = (group, value) => {
    if (group === "materials") {
      return value === "self" ? state.materials.size === 0 : state.materials.has(value);
    }

    if (group === "features") {
      return value === "none" ? state.features.size === 0 : state.features.has(value);
    }

    const stateKey = group === "plans" ? "plan" : group === "siteTypes" ? "siteType" : group;
    return state[stateKey] === value;
  };

  const renderOptionGroup = (group) => {
    const container = tool.querySelector(`[data-estimate-options="${group}"]`);
    if (!container) return;

    container.innerHTML = Object.entries(PRICING_DATA[group])
      .map(([value, item]) => {
        const selected = isSelected(group, value);
        return `
          <button
            class="estimate-option${selected ? " is-selected" : ""}"
            type="button"
            data-estimate-group="${group}"
            data-estimate-value="${value}"
            aria-pressed="${selected}"
          >
            <span class="estimate-option__label">${item.label}</span>
            <span class="estimate-option__price">${item.priceLabel}</span>
            ${item.note ? `<span class="estimate-option__note">${item.note}</span>` : ""}
          </button>
        `;
      })
      .join("");
  };

  const renderOptions = () => {
    Object.keys(PRICING_DATA).forEach((group) => {
      if (tool.querySelector(`[data-estimate-options="${group}"]`)) {
        renderOptionGroup(group);
      }
    });
  };

  const sumSelected = (group, selectedValues) =>
    [...selectedValues].reduce((total, value) => total + PRICING_DATA[group][value].price, 0);

  const getCalculation = () => {
    const diagnosisOnly = state.siteType === "diagnosis";
    const partialOnly = state.siteType === "partial";
    const base = diagnosisOnly || partialOnly ? 0 : PRICING_DATA.plans[state.plan].price;
    const pages = diagnosisOnly ? 0 : PRICING_DATA.pages[state.pages].price;
    const materials = diagnosisOnly ? 0 : sumSelected("materials", state.materials);
    const features = diagnosisOnly ? 0 : sumSelected("features", state.features);
    const site = PRICING_DATA.siteTypes[state.siteType].price;
    const monthly = diagnosisOnly ? 0 : PRICING_DATA.maintenance[state.maintenance].price;

    return {
      base,
      pages,
      materials,
      features,
      site,
      monthly,
      total: base + pages + materials + features + site,
    };
  };

  const getSelectedLabels = (group, values, emptyLabel) => {
    if (values.size === 0) return emptyLabel;
    return [...values].map((value) => PRICING_DATA[group][value].label).join("、");
  };

  const getNotes = () => {
    const notes = ["初期費用・追加オプションは税別、月額保守は税込です。"];
    const selectedMinimums = [
      ...[...state.materials].map((value) => PRICING_DATA.materials[value]),
      ...[...state.features].map((value) => PRICING_DATA.features[value]),
      PRICING_DATA.siteTypes[state.siteType],
    ].filter((item) => item.minimum);

    if (state.plan === "maintenance") {
      notes.push("保守セットの初期制作費は、月額保守の継続利用を前提としています。");
    }

    if (state.siteType === "partial") {
      notes.push("一部ページ修正では、基本プラン費を含めず最低修正費から計算しています。");
    }

    if (state.siteType === "diagnosis") {
      notes.push("改善診断のみでは、制作・ページ・素材・機能・月額保守を合計に含めていません。");
    }

    if (selectedMinimums.length > 0) {
      notes.push("「〜」表記の項目は最低価格で計算しています。");
    }

    return notes;
  };

  const renderResult = () => {
    const calculation = getCalculation();
    const outputs = {
      "[data-result-base]": formatYen(calculation.base),
      "[data-result-pages]": formatYen(calculation.pages),
      "[data-result-materials]": formatYen(calculation.materials),
      "[data-result-features]": formatYen(calculation.features),
      "[data-result-site]": formatYen(calculation.site),
      "[data-result-total]": formatYen(calculation.total),
      "[data-result-monthly]": formatYen(calculation.monthly),
    };

    Object.entries(outputs).forEach(([selector, value]) => {
      const output = tool.querySelector(selector);
      if (output) output.textContent = value;
    });

    const noteList = tool.querySelector("[data-result-notes]");
    noteList.innerHTML = getNotes().map((note) => `<li>${note}</li>`).join("");
  };

  const updateSingleSelection = (group, value) => {
    const stateKey = group === "plans" ? "plan" : group === "siteTypes" ? "siteType" : group;
    state[stateKey] = value;

    if (group === "plans" && value === "maintenance" && state.maintenance === "none") {
      state.maintenance = "light";
    }

    if (group === "maintenance" && value === "none" && state.plan === "maintenance") {
      state.plan = "once";
    }
  };

  const updateMultipleSelection = (group, value) => {
    const selected = state[group];
    const item = PRICING_DATA[group][value];

    if (item.reset) {
      selected.clear();
      return;
    }

    if (selected.has(value)) {
      selected.delete(value);
    } else {
      selected.add(value);
    }
  };

  const createInquirySummary = () => {
    const calculation = getCalculation();
    const pageLabel =
      state.pages === "0" ? "追加なし" : `${state.pages}ページ（${formatYen(calculation.pages)}）`;

    return [
      "【自動見積もりの条件】",
      `基本プラン：${PRICING_DATA.plans[state.plan].label}`,
      `追加ページ：${pageLabel}`,
      `素材準備：${getSelectedLabels("materials", state.materials, "自分で用意")}`,
      `機能追加：${getSelectedLabels("features", state.features, "追加なし")}`,
      `既存サイト対応：${PRICING_DATA.siteTypes[state.siteType].label}`,
      `保守プラン：${PRICING_DATA.maintenance[state.maintenance].label}`,
      "",
      `初期費用概算：${formatYen(calculation.total)}（税別）`,
      `月額保守費：${formatYen(calculation.monthly)}（税込）`,
      "",
      "上記の条件で詳しい内容を相談したいです。",
    ].join("\n");
  };

  tool.addEventListener("click", (event) => {
    const option = event.target.closest("[data-estimate-group]");
    if (!option) return;

    const { estimateGroup: group, estimateValue: value } = option.dataset;

    if (multipleGroups.has(group)) {
      updateMultipleSelection(group, value);
    } else {
      updateSingleSelection(group, value);
    }

    renderOptions();
    renderResult();
  });

  const consultButton = tool.querySelector("[data-estimate-consult]");
  consultButton.addEventListener("click", () => {
    const inquirySelect = document.querySelector("[data-inquiry-select]");
    const message = document.querySelector("[data-inquiry-message]");

    if (inquirySelect) inquirySelect.value = "Web制作のご相談";
    if (message) message.value = createInquirySummary();

    window.setTimeout(() => {
      message?.focus({ preventScroll: true });
    }, 500);
  });

  renderOptions();
  renderResult();
})();
