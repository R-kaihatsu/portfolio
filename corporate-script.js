document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero .slide");

  if (slides.length <= 1) {
    return;
  }

  let currentIndex = 0;
  const intervalTime = 4500;

  setInterval(() => {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }, intervalTime);
});
