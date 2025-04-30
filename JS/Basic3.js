
const carousel = document.querySelector(".carousel");
const wrapper = document.querySelector(".wrapper");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const dotsContainer = document.getElementById("dots");
const Arrows = document.querySelector(".arrows");

const totalRealSlides = slides.length - 8;
let currentIndex = 4;

let slideWidth;
let visibleCenterOffset;
let currentTranslate;
let slidesInView = 1;
let NumOfSlides = 1;

let A0;
let A1 = Math.floor(slides.length / 2);
let A2 = Math.floor(slides.length / 3);
let A3 = Math.floor(slides.length - 2 * A1);
let A4 = Math.floor(slides.length - 3 * A2);

let autoplayTimer = null;
let autoplayInterval = 3000;
let idleTimeout = null;

updateDimensions();

function updateDimensions() {
 
  if (window.innerWidth >= 900) {
    
    slidesInView = (A4 == 0) ? 3 : 1;
    A0 = (A4 == 0) ? 7 : 6;
    NumOfSlides = 3;

    slides.forEach(slide => {
    slide.style.width = Math.floor((window.innerWidth - 32)/3) + "px";  //Style 1
    slide.style.width = Math.floor((window.innerWidth - 5*16)/3) + "px";  //Style 2
    });

    Arrows.style.width = Math.floor(window.innerWidth - 2*32 + 50) + "px";  //Style 1
    Arrows.style.width = Math.floor(window.innerWidth - 7*16 + 50) + "px";  //Style 2

  } else if (window.innerWidth > 600 && window.innerWidth < 900) {
    
    slidesInView = (A3 == 0) ? 2 : 1;
    NumOfSlides = 2;
    A0 = 6;

    slides.forEach(slide => {
    slide.style.width = Math.floor((window.innerWidth - 32)/2) + "px";  //Style 1
    slide.style.width = Math.floor((window.innerWidth - 5*16)/2) + "px";  //Style 2
    });

    Arrows.style.width = Math.floor(window.innerWidth - 2*32 + 50) + "px";  //Style1
    Arrows.style.width = Math.floor(window.innerWidth - 7*16 + 50) + "px";  //Style2

  } else {
    slidesInView = 1;
    NumOfSlides = 1;
    A0 = 6;

    slides.forEach(slide => {
    slide.style.width = Math.floor(window.innerWidth - 32) + "px";  //Style 1
    slide.style.width = "282px";  //Style 2
    });

    Arrows.style.width = Math.floor(window.innerWidth - 2*32 + 50) + "px";  //Style 1
    Arrows.style.width = "300px";  //Style 2

  }
  
  slideWidth = slides[0].offsetWidth;

  createDots();
  visibleCenterOffset = (window.innerWidth - slideWidth * NumOfSlides) / 2;
  applyTranslate(false);
}

window.addEventListener("resize", updateDimensions);

function applyTranslate(animate = true) {
  carousel.style.transition = animate ? "0.4s" : "none";
  currentTranslate = Math.round(-slideWidth * currentIndex + visibleCenterOffset);
  carousel.style.transform = `translateX(${currentTranslate}px)`;
  updateDots();
}

let isAnimating = false;

function updateCarousel(direction) {
  if (isAnimating) return;
  isAnimating = true;

  if (direction === 'next') currentIndex += slidesInView;
  else currentIndex -= slidesInView;

  applyTranslate(true);

  setTimeout(() => {
    let reset = false;

    if (currentIndex >= slides.length - 4) {
      currentIndex = 4;
      reset = true;
    } else if (currentIndex <= 2) {
      currentIndex = slides.length - A0;
      reset = true;
    }

    if (reset) {
      // Temporarily disable transition to avoid visible jump
      carousel.style.transition = "none";
      applyTranslate(false);
    }

    isAnimating = false;
  }, 400); // matches your slide transition time
  resetAutoplayDelay();
}


btnLeft.addEventListener("click", () => {
  if (!isAnimating) updateCarousel("prev");
});

btnRight.addEventListener("click", () => {
  if (!isAnimating) updateCarousel("next");
});


function createDots() {
  dotsContainer.innerHTML = "";
  const totalDotCount = Math.floor(totalRealSlides / slidesInView);
  for (let i = 0; i < totalDotCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentIndex = i * slidesInView + 4;
      applyTranslate(true);
      resetAutoplayDelay();
    });
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  let relativeIndex = (currentIndex - 4) % totalRealSlides;
  if (relativeIndex < 0) relativeIndex += totalRealSlides; // ensure positive

  const activeGroupIndex = Math.floor(relativeIndex / slidesInView);

  document.querySelectorAll(".dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeGroupIndex);
  });
}


function startAutoplay() {
  if (autoplayTimer) return;
  autoplayTimer = setInterval(() => {
    updateCarousel("next");
  }, autoplayInterval);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
  clearTimeout(idleTimeout);
}

function resetAutoplayDelay() {
  stopAutoplay();
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    startAutoplay();
  }, 5000);
}

dragElement(carousel);
createDots();
applyTranslate(false);
resetAutoplayDelay(); // Initial autoplay start

function dragElement(el) {
  let isDragging = false;
  let dragged = false;
  let startX = 0;
  let currentX = 0;
  let velocity = 0;
  let lastTime = 0;
  let lastX = 0;

  el.addEventListener("mousedown", dragStart);
  el.addEventListener("touchstart", dragStart);

  function dragStart(e) {
    stopAutoplay();
    isDragging = true;
    startX = getPositionX(e);
    lastX = startX;
    lastTime = Date.now();
    el.style.transition = "none";

    carousel.style.cursor="grab";

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchmove", dragMove);
    document.addEventListener("touchend", dragEnd);
  }

  function dragMove(e) {
    if (!isDragging) return;
    dragged = true;
    currentX = getPositionX(e);
    const deltaX = currentX - startX;
    el.style.transform = `translateX(${currentTranslate + deltaX}px)`;

    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocity = (currentX - lastX) / dt;
      lastTime = now;
      lastX = currentX;
    }
    carousel.style.cursor="grabbing";

}

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;

    if (!dragged) return;
    dragged = false;
    const deltaX = currentX - startX;

    if (Math.abs(velocity) > 0.5) {
      currentIndex += velocity < 0 ? slidesInView : -slidesInView;
    } else {
      if (deltaX < -80) currentIndex += slidesInView;
      else if (deltaX > 80) currentIndex -= slidesInView;
    }

    applyTranslate(true);
    carousel.style.cursor="grab";
    setTimeout(() => {
      if (currentIndex >= slides.length - 4) {
        currentIndex = 4;
        applyTranslate(false);
      } else if (currentIndex <= 2) {
        currentIndex = slides.length - A0;
        applyTranslate(false);
      }
    }, 400);

    resetAutoplayDelay();

    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("touchend", dragEnd);
  }

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
  }
}
