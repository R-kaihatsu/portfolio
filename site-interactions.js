(() => {
  const year = document.querySelector("[data-current-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const inquirySelect = document.querySelector("[data-inquiry-select]");

  document.querySelectorAll("[data-inquiry]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!inquirySelect) return;

      const value = link.dataset.inquiry;
      const hasOption = [...inquirySelect.options].some((option) => option.value === value);

      if (hasOption) {
        inquirySelect.value = value;
      }
    });
  });
})();
