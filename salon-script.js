document.addEventListener("DOMContentLoaded", () => {
  const fadeTargets = document.querySelectorAll(".fade-in");

  if (!("IntersectionObserver" in window)) {
    fadeTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15
    }
  );

  fadeTargets.forEach((target) => observer.observe(target));
});
