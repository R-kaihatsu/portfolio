const hamburgerButton = document.querySelector(".hamburger-button");
const mobileNav = document.querySelector("#mobile-menu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
const contactForm = document.querySelector("#contactForm");

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

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent;

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "送信中...";
    }

    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      contactForm.reset();
      window.location.href = "thanks.html";
      return;
    }

    alert("送信に失敗しました。時間をおいてもう一度お試しください。");
  } catch (error) {
    alert("通信エラーが発生しました。時間をおいてもう一度お試しください。");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
});
