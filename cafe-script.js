const hamburgerButton = document.querySelector(".hamburger-button");
const mobileNav = document.querySelector("#mobile-menu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

const closeMobileNav = () => {
  document.body.classList.remove("nav-open");
  hamburgerButton?.classList.remove("active");
  mobileNav?.classList.remove("active");
  hamburgerButton?.setAttribute("aria-expanded", "false");
  hamburgerButton?.setAttribute("aria-label", "メニューを開く");
  mobileNav?.setAttribute("aria-hidden", "true");
};

hamburgerButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");

  hamburgerButton.classList.toggle("active", isOpen);
  mobileNav?.classList.toggle("active", isOpen);
  hamburgerButton.setAttribute("aria-expanded", String(isOpen));
  hamburgerButton.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  mobileNav?.setAttribute("aria-hidden", String(!isOpen));
});

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

mobileNav?.addEventListener("click", (event) => {
  if (event.target === mobileNav) {
    closeMobileNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileNav();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileNav();
  }
});
