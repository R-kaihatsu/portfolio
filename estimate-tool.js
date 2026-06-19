(() => {
  const tool = document.querySelector("[data-estimate-tool]");
  if (!tool) return;

  const DATA = {
    purposes: {
      new: {
        label: "新しくサイトを作りたい",
        shortLabel: "Web制作について相談",
        note: "お店や事業のサイトを新しく用意したい",
      },
      fix: {
        label: "今のサイトを直したい",
        shortLabel: "既存サイトの修正について相談",
        note: "一部修正、見直し、リニューアル",
      },
      maintenance: {
        label: "公開後の保守を頼みたい",
        shortLabel: "保守サポートについて相談",
        note: "更新や状態確認を継続して頼みたい",
      },
      unsure: {
        label: "まだ決まっていない",
        shortLabel: "まずは無料相談",
        note: "何から頼めばいいか一緒に整理したい",
      },
    },
    pageRanges: {
      one: { label: "1ページ", note: "小さな紹介ページ" },
      standard: { label: "2〜5ページ", note: "一般的な店舗・事業サイト" },
      many: { label: "6ページ以上", note: "内容が多いサイト" },
    },
    featureBundles: {
      none: { label: "特になし", note: "まずは基本構成で" },
      contact: { label: "フォーム・地図", note: "問い合わせや来店案内" },
      booking: { label: "予約機能", note: "外部予約サービスを含む" },
      ec: { label: "販売機能", note: "商品・サービスを販売" },
    },
    maintenanceChoices: {
      none: { label: "保守なし", note: "公開後は自分で管理", monthly: 0 },
      light: { label: "軽い保守を頼む", note: "状態確認と小さな相談", monthly: 6980 },
      standard: { label: "更新も頼む", note: "お知らせや画像の更新", monthly: 9800 },
    },
  };

  const state = {
    purpose: null,
    pageRange: "standard",
    featureBundle: "none",
    maintenanceChoice: "light",
  };

  const groups = {
    purposes: "purpose",
    pageRanges: "pageRange",
    featureBundles: "featureBundle",
    maintenanceChoices: "maintenanceChoice",
  };

  const renderGroup = (groupName) => {
    const container = tool.querySelector(`[data-estimate-options="${groupName}"]`);
    if (!container) return;

    const stateKey = groups[groupName];
    container.innerHTML = Object.entries(DATA[groupName])
      .map(([value, item]) => {
        const selected = state[stateKey] === value;
        return `
          <button
            class="estimate-option${selected ? " is-selected" : ""}"
            type="button"
            data-estimate-group="${groupName}"
            data-estimate-value="${value}"
            aria-pressed="${selected}"
          >
            <span class="estimate-option__label">${item.label}</span>
            <span class="estimate-option__note">${item.note}</span>
          </button>
        `;
      })
      .join("");
  };

  const renderGroups = () => {
    Object.keys(groups).forEach(renderGroup);
  };

  const getInitialEstimate = () => {
    if (!state.purpose) return "選択後に表示";
    if (state.purpose === "unsure") return "相談後にご案内";
    if (state.purpose === "maintenance") return "初期費用なし";

    if (state.purpose === "fix") {
      const fixPrices = {
        one: 10000,
        standard: 30000,
        many: 80000,
      };
      return `${fixPrices[state.pageRange].toLocaleString("ja-JP")}円〜`;
    }

    const maintenanceIncluded = state.maintenanceChoice !== "none";
    let total = maintenanceIncluded ? 58000 : 120000;

    if (state.pageRange === "many") total += 10000;
    if (state.featureBundle === "contact") total += 25000;
    if (state.featureBundle === "booking") total += 30000;
    if (state.featureBundle === "ec") total += 50000;

    return `${total.toLocaleString("ja-JP")}円〜`;
  };

  const getMonthlyEstimate = () => {
    if (!state.purpose) return "—";
    if (state.purpose === "unsure") return "必要な場合のみ";
    if (state.purpose === "fix") return "0円";
    const monthly = DATA.maintenanceChoices[state.maintenanceChoice].monthly;
    return monthly === 0 ? "0円" : `${monthly.toLocaleString("ja-JP")}円〜`;
  };

  const getResultMessage = () => {
    if (!state.purpose) {
      return "左から、今の状況にいちばん近いものを選んでください。";
    }
    if (state.purpose === "unsure") {
      return "サイトが必要かどうか、というところからお話しできます。";
    }
    if (state.purpose === "maintenance") {
      return "現在のサイトと更新したい内容を確認して、合う保守範囲をご案内します。";
    }
    if (state.purpose === "fix") {
      return "直したい箇所を見てから、作り直さずに済む方法も含めて確認します。";
    }
    return "ページ数や機能は目安です。必要ないものを外しながら一緒に決められます。";
  };

  const renderFollowups = () => {
    if (!state.purpose) {
      tool.querySelector("[data-estimate-followups]").hidden = true;
      return;
    }

    const showPages = ["new", "fix"].includes(state.purpose);
    const showFeatures = state.purpose === "new";
    const showMaintenance = ["new", "maintenance"].includes(state.purpose);

    tool.querySelector('[data-estimate-step="pages"]').hidden = !showPages;
    tool.querySelector('[data-estimate-step="features"]').hidden = !showFeatures;
    tool.querySelector('[data-estimate-step="maintenance"]').hidden = !showMaintenance;

    const followups = tool.querySelector("[data-estimate-followups]");
    followups.hidden = !(showPages || showFeatures || showMaintenance);
  };

  const renderResult = () => {
    tool.querySelector("[data-result-initial]").textContent = getInitialEstimate();
    tool.querySelector("[data-result-monthly]").textContent = getMonthlyEstimate();
    tool.querySelector("[data-result-recommendation]").textContent =
      state.purpose ? DATA.purposes[state.purpose].shortLabel : "相談内容を選んでください";
    tool.querySelector("[data-result-message]").textContent = getResultMessage();
  };

  const createInquirySummary = () => {
    if (!state.purpose) {
      return "まだ内容が決まっていないため、まずは相談したいです。";
    }

    const lines = [
      "【相談前の目安で選んだ内容】",
      `相談内容：${DATA.purposes[state.purpose].label}`,
    ];

    if (["new", "fix"].includes(state.purpose)) {
      lines.push(`ページ数：${DATA.pageRanges[state.pageRange].label}`);
    }
    if (state.purpose === "new") {
      lines.push(`必要な機能：${DATA.featureBundles[state.featureBundle].label}`);
    }
    if (["new", "maintenance"].includes(state.purpose)) {
      lines.push(`保守：${DATA.maintenanceChoices[state.maintenanceChoice].label}`);
    }

    lines.push(
      "",
      `初期費用の目安：${getInitialEstimate()}（制作・修正費は税別）`,
      `月額保守の目安：${getMonthlyEstimate()}（税込）`,
      "",
      "この内容をもとに相談したいです。",
    );

    return lines.join("\n");
  };

  tool.addEventListener("click", (event) => {
    const option = event.target.closest("[data-estimate-group]");
    if (!option) return;

    const { estimateGroup, estimateValue } = option.dataset;
    state[groups[estimateGroup]] = estimateValue;

    if (estimateGroup === "purposes" && estimateValue === "maintenance") {
      state.maintenanceChoice = "light";
    }

    renderGroups();
    renderFollowups();
    renderResult();
  });

  tool.querySelector("[data-estimate-consult]").addEventListener("click", () => {
    const inquirySelect = document.querySelector("[data-inquiry-select]");
    const message = document.querySelector("[data-inquiry-message]");

    const inquiryValues = {
      new: "Web制作のご相談",
      fix: "既存サイトの改善",
      maintenance: "保守サポートのご相談",
      unsure: "無料相談・簡易チェック",
    };

    if (inquirySelect) {
      inquirySelect.value = state.purpose
        ? inquiryValues[state.purpose]
        : "無料相談・簡易チェック";
    }
    if (message) message.value = createInquirySummary();

    window.setTimeout(() => message?.focus({ preventScroll: true }), 500);
  });

  renderGroups();
  renderFollowups();
  renderResult();
})();
