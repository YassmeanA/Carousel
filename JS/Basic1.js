
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper .arrow");
const wrapper = document.querySelector(".wrapper");
const firstCard = document.querySelector(".slide");
const dotsContainer = document.getElementById("dots");
const Slides = document.querySelectorAll(".slide");
const firstCardWidth = firstCard.offsetWidth;
const totalCardWidth = carousel.scrollWidth;
const maxScrollLeft = totalCardWidth - carousel.offsetWidth;

let currentIndex = 0;
let slidesInView = 1;

updateDimensions();

window.addEventListener("resize", updateDimensions);

function updateDimensions() {

if (window.innerWidth <= 600){slidesInView = 1;}

else if (window.innerWidth > 600 && window.innerWidth < 900){slidesInView = 2;}

else if (window.innerWidth >= 900){ slidesInView = 3;};

createDots();
updateDots();

}


//Check if the user uses touchscreen or not
if ("ontouchstart" in document.documentElement)

{carousel.classList.add("touch");carousel.classList.remove("mouse");}

else {carousel.classList.add("mouse");carousel.classList.remove("touch");}

//Dragging by mouse
    if(carousel.classList.contains("mouse")){
    
      let isDragging = false,
        hasDragged = false,
        startX,
        startScrollLeft;
    
    const dragThreshold = 5; // pixels
    
    const snapToNearestCard = () => {
      const scrollLeft = carousel.scrollLeft;
      const index = Math.round(scrollLeft / firstCardWidth);
      carousel.scrollTo({
        left: index * firstCardWidth,
        behavior: "smooth"
      });
    };
    
    const dragStart = (e) => {
      stopAutoplay();
      isDragging = true;
      hasDragged = false;
      carousel.style.cursor = "grab";
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    };
    
    const dragging = (e) => {
      if (!isDragging) return;
    
      const moved = Math.abs(e.pageX - startX);
      if (moved > dragThreshold) {
        hasDragged = true;
        carousel.style.cursor = "grabbing";
        e.preventDefault(); // Prevent text/image selection
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
      }
    };
    
    const dragStop = () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = "grab";
      if (hasDragged) {
        snapToNearestCard();
      }
      setTimeout(() => {
        carousel.classList.remove("dragging");
      }, 300);
    
        startAutoplay();
    };
    
    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
      
    }

function applyScroll() {
  carousel.scrollLeft = currentIndex * firstCardWidth;
}

function createDots() {
  dotsContainer.innerHTML = "";
  const totalDotCount = Math.ceil(Slides.length / slidesInView);

  for (let i = 0; i < totalDotCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      stopAutoplay();

      let A0 = Math.floor(Slides.length / 3);
      let A1 = Slides.length - 3 * A0;
      let A2 = Math.floor(Slides.length / 2);
      let A3 = Slides.length - 2 * A2;

      if (i === totalDotCount - 1 && slidesInView === 3 && A1 === 1) {
        currentIndex = i * slidesInView - 2;
      } else if (i === totalDotCount - 1 && slidesInView === 3 && A1 === 2) {
        currentIndex = i * slidesInView - 1;
      } else if (i === totalDotCount - 1 && slidesInView === 2 && A3 === 1) {
        currentIndex = i * slidesInView - 1;
      } else {
        currentIndex = i * slidesInView;
      }

      applyScroll();
      updateDots();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateDots() {

  // Adjust current group index (handle partial groups properly)
  const maxIndex = Slides.length - slidesInView;
  const clampedIndex = Math.min(currentIndex, maxIndex);
  const activeGroupIndex = Math.ceil(clampedIndex / slidesInView);

  document.querySelectorAll(".dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeGroupIndex);
  });
}

const Arrows = () => {
  arrowBtns[0].style.display = carousel.scrollLeft <= 100 ? "none" : "block";
  arrowBtns[1].style.display = carousel.scrollLeft >= maxScrollLeft - 200 ? "none" : "block";

  // Sync currentIndex from scroll position
  const approxIndex = Math.round(carousel.scrollLeft / firstCardWidth);
  currentIndex = Math.min(approxIndex, Slides.length - slidesInView);

  updateDots();
};

// Initial render
createDots();
updateDots();

// Listen to scroll
carousel.addEventListener("scroll", () => {
  
Arrows();
resetAutoplayDelay();

});

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
btn.addEventListener("click", () => { 

resetAutoplayDelay();

if (window.innerWidth <= 600){
carousel.scrollLeft += btn.id === "left" ? 
-firstCardWidth : firstCardWidth;};

if (window.innerWidth > 600 && window.innerWidth < 900){
carousel.scrollLeft += btn.id === "left" ? 
-2*firstCardWidth : 2*firstCardWidth;};

if (window.innerWidth >= 900){
carousel.scrollLeft += btn.id === "left" ? 
 -3*firstCardWidth : 3*firstCardWidth;};

});

});



// Autoplay logic

let autoplayTimer = null;
let autoplayInterval = 3000;
let idleTimeout = null;

function startAutoplay() {

  if (autoplayTimer) return;
  autoplayTimer = setInterval(() => {

  if(window.innerWidth <= 600){carousel.scrollLeft += firstCardWidth;}
  else if(window.innerWidth > 600 && window.innerWidth < 900){carousel.scrollLeft += 2 * firstCardWidth;}
  else if(window.innerWidth >= 900){carousel.scrollLeft += 3 * firstCardWidth;}
  
  if(carousel.scrollLeft >= maxScrollLeft - 200){carousel.scrollLeft = 0;}

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

resetAutoplayDelay();
