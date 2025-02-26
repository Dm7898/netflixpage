"use strict";

const main = document.querySelector(".main");
let index = 0;

const renderHtml = (data) => {
  main.innerHTML = "";

  const section = document.createElement("section");
  section.classList.add("hero");
  const heroImg = data.series.img;
  const desc = data.series.desc.slice(0, 180);
  section.style.backgroundImage = `url('${heroImg}')`;
  section.innerHTML = `
  
    <div class="container">
      <div class="row series">
        <div class="series-banner col-sm-12 col-md-6 col-lg-7"></div>
        <div class="series-data col-sm-12 col-md-6 col-lg-5">
          <h2 class="series-title">${data.series.title}</h2>
          <p class="series-para">${desc}...</p>
          <div class="flex">
            <button class="btn-red">Watch</button>
            <button class="btn-outline">My List</button>
          </div>
        </div>
      </div>
    </div>
    <div class="carousel-container">
      <button class="btn prev">&#10094;</button>
      <button class="btn next">&#10095;</button>
      <div class="carousel">
        ${data.episodes
          .map(
            (episode, index) => `
        <div class="item-carsouel" data-index="${index}" data-img="${
              episode.img
            }" data-title="Episode ${index}" data-duration="46min">
          <img src="${episode.img}" alt="Episode Image" />
          <p class="flex"><span>Episode ${
            index + 1
          }</span><span>46min</span></p>
          <div class="overlay">
            <i class="fa-regular fa-circle-play"></i>
          </div>
        </div>
        `
          )
          .join("")}
      </div>
    </div>

     <!-- Modal Structure -->
    <div class="modal" id="episodeModal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-img">
        <img id="modalImg" src="" alt="Episode Image">
         <i class="fa-regular fa-circle-play"></i>
        </div>
        <h2 id="modalTitle"></h2>
        <p id="modalDuration"></p>
      </div>
    </div>
    <div class="black-gradient"></div>
    `;

  // Append the section to main
  main.appendChild(section);
};

const carouselFun = () => {
  const carouselContainer = document.querySelector(".carousel-container");
  if (!carouselContainer) {
    console.error("Error: .carousel-container not found in the DOM.");
    return;
  }

  const carousel = document.querySelector(".carousel");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let index = 0;

  // Function to calculate carousel dimensions
  const updateDimensions = () => {
    const images = document.querySelectorAll(".carousel .item-carsouel");

    if (images.length === 0) {
      console.error("Error: No images found in the carousel.");
      return;
    }

    const imageWidth = images[0].getBoundingClientRect().width + 10; // Include margin
    const visibleImages = Math.floor(
      carouselContainer.clientWidth / imageWidth
    );
    const maxIndex = images.length - visibleImages;

    console.log("Visible images:", visibleImages);

    const updateCarousel = () => {
      const translateX = -index * imageWidth;
      carousel.style.transform = `translateX(${translateX}px)`;
      carousel.style.transition = "transform 0.5s ease-in-out";

      prevBtn.style.display = index === 0 ? "none" : "block";
      nextBtn.style.display = index >= maxIndex ? "none" : "block";
    };

    nextBtn.addEventListener("click", () => {
      if (index < maxIndex) {
        index++;
        updateCarousel();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (index > 0) {
        index--;
        updateCarousel();
      }
    });

    updateCarousel();
  };

  // Ensure function runs after fetchData() updates the DOM
  setTimeout(updateDimensions, 500);

  window.addEventListener("resize", () => {
    index = 0;
    updateDimensions();
  });
};

// Ensure function runs after DOM loads
document.addEventListener("DOMContentLoaded", carouselFun);

window.addEventListener("resize", () => {
  index = 0;
  carouselFun();
});

const setupModal = () => {
  const modal = document.getElementById("episodeModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDuration = document.getElementById("modalDuration");
  const closeModal = document.querySelector(".close");

  document.querySelectorAll(".item-carsouel").forEach((item) => {
    item.addEventListener("click", function () {
      modal.style.display = "flex";
      modalImg.src = this.getAttribute("data-img");
      modalTitle.textContent = this.getAttribute("data-title");
      modalDuration.textContent = `Duration: ${this.getAttribute(
        "data-duration"
      )}`;
    });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
};

const fetchData = async () => {
  try {
    const res = await fetch(
      "https://repo-tech2edge.github.io/tasks/sample.json"
    );
    const data = await res.json();

    if (data) {
      renderHtml(data);
      setTimeout(carouselFun, 500); // Ensure carousel runs after DOM update
    }
  } catch (err) {
    console.error(err);
  }
};
// Run setupModal after fetching data
fetchData().then(() => {
  setTimeout(setupModal, 500);
});

// fetchData();
