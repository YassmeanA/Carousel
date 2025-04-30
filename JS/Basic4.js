const carousel = document.querySelector(".carousel");
const wrapper = document.querySelector(".wrapper");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const dotsContainer = document.getElementById("dots");
const Arrows = document.querySelector(".arrows");

let currentIndex = 0;
let slideWidth;
let visibleCenterOffset;
let currentTranslate;
let slidesInView = 1;
let NumOfSlides = 1;

let autoplayTimer = null;
let autoplayInterval = 3000;
let idleTimeout = null;

updateDimensions();

function updateDimensions() {

  if (window.innerWidth >= 900) {
    slidesInView = 3;
    NumOfSlides = 3;

    slides.forEach(slide => {
    slide.style.width = Math.floor((window.innerWidth - 32)/3) + "px";  //Style 1
    slide.style.width = Math.floor((window.innerWidth - 5*16)/3) + "px";  //Style 2
    });

    Arrows.style.width = Math.floor(window.innerWidth - 2*32 + 50) + "px";  //Style 1
    Arrows.style.width = Math.floor(window.innerWidth - 7*16 + 50) + "px";  //Style 2

  } else if (window.innerWidth > 600 && window.innerWidth < 900) {
    slidesInView = 2;
    NumOfSlides = 2;

    slides.forEach(slide => {
    slide.style.width = Math.floor((window.innerWidth - 32)/2) + "px";  //Style 1
    slide.style.width = Math.floor((window.innerWidth - 5*16)/2) + "px";  //Style 2
    });

    Arrows.style.width = Math.floor(window.innerWidth - 2*32 + 50) + "px";  //Style 1
    Arrows.style.width = Math.floor(window.innerWidth - 7*16 + 50) + "px";  //Style 2

  } else {

    slidesInView = 1;
    NumOfSlides = 1;

    slides.forEach(slide => {
    slide.style.width = Math.floor(window.innerWidth - 32) + "px";  //Style 1
    slide.style.width = "282px"; //Style 2
    });

    Arrows.style.width = Math.floor(window.innerWidth - 2*32 + 50) + "px";  //Style 1
    Arrows.style.width = "300px"; //Style2
    

  }

  slideWidth = slides[0].offsetWidth;

  createDots();
  visibleCenterOffset = (window.innerWidth - slideWidth * NumOfSlides) / 2;
  applyTranslate(false);
  updateArrowVisibility();
}

window.addEventListener("resize", updateDimensions);

function applyTranslate(animate = true) {
  carousel.style.transition = animate ? "0.4s" : "none";
  currentTranslate = Math.round(-slideWidth * currentIndex + visibleCenterOffset);
  carousel.style.transform = `translateX(${currentTranslate}px)`;
  updateDots();
  updateArrowVisibility();
}

let isAnimating = false;

function updateCarousel(direction) {
  if (isAnimating) return;
  const maxIndex = Math.max(0, slides.length - slidesInView);

  if (direction === "next" && currentIndex >= maxIndex) return;
  if (direction === "prev" && currentIndex <= 0) return;

  isAnimating = true;

  if (direction === "next") {
    currentIndex = Math.min(currentIndex + slidesInView, maxIndex);
  } else if (direction === "prev") {
    currentIndex = Math.max(currentIndex - slidesInView, 0);
  }

  applyTranslate(true);

  setTimeout(() => {
    isAnimating = false;
  }, 400); // Matches the transition time you defined in applyTranslate
  resetAutoplayDelay();
}

btnLeft.addEventListener("click", () => {
  if (!isAnimating) updateCarousel("prev");
resetAutoplayDelay();
});

btnRight.addEventListener("click", () => {
  if (!isAnimating) updateCarousel("next");
resetAutoplayDelay();
});


function updateArrowVisibility() {
  const maxStartIndex = Math.max(0, slides.length - slidesInView);
  btnLeft.style.display = currentIndex === 0 ? "none" : "block";
  btnRight.style.display = currentIndex >= maxStartIndex ? "none" : "block";
}


function createDots() {

dotsContainer.innerHTML = "";
const totalDotCount = Math.ceil(slides.length / slidesInView);

for (let i = 0; i < totalDotCount; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
   
let A0 = Math.floor(slides.length / 3);
let A1 = Math.floor(slides.length - 3*A0);
let A2 = Math.floor(slides.length / 2);
let A3 = Math.floor(slides.length - 2*A2);

if(i == totalDotCount - 1 && slidesInView == 3 && A1 == 1){currentIndex = i * slidesInView - 2;}

else if(i == totalDotCount - 1 && slidesInView == 3 && A1 == 2){currentIndex = i * slidesInView - 1;}

else if(i == totalDotCount - 1 && slidesInView == 2 && A3 == 1){currentIndex = i * slidesInView - 1;}

else{currentIndex = i * slidesInView;}
   
 applyTranslate(true);
 resetAutoplayDelay();
 
});
  dotsContainer.appendChild(dot);
}
}

function updateDots() {
const activeGroupIndex = Math.ceil(currentIndex / slidesInView);
document.querySelectorAll(".dot").forEach((dot, idx) => {
  dot.classList.toggle("active", idx === activeGroupIndex);
});
}

createDots();
applyTranslate(false);
dragElement(carousel);

// Autoplay logic
function startAutoplay() {
  if (autoplayTimer) return;
  autoplayTimer = setInterval(() => {
    const maxStartIndex = Math.max(0, slides.length - slidesInView);
    const remainingSlides = slides.length - currentIndex - slidesInView;

    if (currentIndex >= maxStartIndex) {
      currentIndex = 0;
    } else {
      const increment = remainingSlides < slidesInView ? remainingSlides : slidesInView;
      currentIndex += increment;
    }

    applyTranslate(true);
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

// Drag logic with autoplay awareness
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

    carousel.style.cursor="grab";

    const maxStartIndex = Math.max(0, slides.length - slidesInView);
    currentIndex = Math.max(0, Math.min(currentIndex, maxStartIndex));
    applyTranslate(true);
    updateArrowVisibility();

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

// Initial autoplay delay trigger
resetAutoplayDelay();
