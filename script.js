document.addEventListener("DOMContentLoaded", function () {

  // --- 1. Sticky Header ---
  const stickyHeader = document.querySelector(".sticky-header");
  const heroSection = document.querySelector(".hero");

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", function () {
    const currentScroll = window.scrollY;

    if (!stickyHeader || !heroSection) return;

    // If scrolled past hero section
    if (currentScroll > heroSection.offsetHeight) {
      // Show only when scrolling down
      if (currentScroll > lastScrollY) {
        stickyHeader.classList.add("active");
      } else {
        stickyHeader.classList.remove("active");
      }
    } else {
      stickyHeader.classList.remove("active");
    }

    lastScrollY = currentScroll;
  });


document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('mainImage');
    const zoomContainer = document.getElementById('zoomContainer');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;

    // 1. Zoom Functionality [cite: 16, 17, 38]
    zoomContainer.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = zoomContainer.getBoundingClientRect();
        
        // Calculate mouse position relative to image in percentage
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        
        // Apply transform to scale and move origin to mouse position [cite: 18]
        mainImage.style.transformOrigin = `${x}% ${y}%`;
        mainImage.style.transform = "scale(2)"; 
    });

    zoomContainer.addEventListener('mouseleave', () => {
        // Reset image to original state [cite: 13]
        mainImage.style.transform = "scale(1)";
        mainImage.style.transformOrigin = "center center";
    });

    // 2. Carousel Image Update Function 
    const updateGallery = (index) => {
        currentIndex = index;
        
        // Add a smooth fade transition if desired in CSS [cite: 13, 18]
        mainImage.src = thumbnails[currentIndex].src;
        
        // Update active thumbnail state
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[currentIndex].classList.add('active');
    };

    // 3. Navigation Controls [cite: 15]
    prevBtn.addEventListener('click', () => {
        let newIndex = currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1;
        updateGallery(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        let newIndex = (currentIndex + 1) % thumbnails.length;
        updateGallery(newIndex);
    });

    // 4. Thumbnail Clicks [cite: 15]
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => updateGallery(index));
    });
});


  // --- 3. Section 5 Horizontal Slider Logic ---
  const track = document.getElementById("s5-track");
  const btnPrev = document.querySelector(".s5-prev");
  const btnNext = document.querySelector(".s5-next");
  
  if (track && btnPrev && btnNext) {
    let currentSlide = 0;

    btnNext.addEventListener("click", () => {
      const cards = document.querySelectorAll(".app-card");
      // Calculate max clicks based on screen size
      const maxSlides = cards.length - Math.floor(track.parentElement.offsetWidth / cards[0].offsetWidth);
      
      if (currentSlide < maxSlides) {
        currentSlide++;
        updateSliderPosition();
      }
    });

    btnPrev.addEventListener("click", () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSliderPosition();
      }
    });

    function updateSliderPosition() {
      const cardWidth = document.querySelector(".app-card").offsetWidth;
      const gap = 24; // matches the CSS gap
      const offset = currentSlide * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
    }
    
    // Recalculate on window resize
    window.addEventListener('resize', () => {
        currentSlide = 0;
        track.style.transform = `translateX(0px)`;
    });
  }


  // --- 4. Section 6 Manufacturing Process Tabs ---
  const processTabs = document.querySelectorAll(".process-tab");
  const processTitle = document.querySelector(".process-text h3");
  const processDesc = document.querySelector(".process-text p");
  const featureList = document.querySelector(".feature-list");
  const processImg = document.querySelector(".process-img");
  const processPrevBtn = document.querySelector(".process-image-container .prev-btn");
  const processNextBtn = document.querySelector(".process-image-container .next-btn");

  // Data for each tab (Update these with your actual content/images)
  const processData = [
    {
      title: "High-Grade Raw Material Selection",
      desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
      bullets: ["PE100 grade material", "Optimal molecular weight distribution"],
      imgSrc: "assets/images/Fishnet.jpg"
    },
    {
      title: "Precision Extrusion Technology",
      desc: "State-of-the-art single screw extruders melt and homogenize the HDPE material with precise temperature controls for a flawless pipe structure.",
      bullets: ["Advanced melt temperature control", "High-capacity consistent output"],
      imgSrc: "assets/images/Fishnet.jpg" // Replace with actual image path
    },
    {
      title: "Advanced Cooling Systems",
      desc: "Multi-stage water cooling baths systematically lower the temperature of the extruded pipe to lock in dimensional stability and strength.",
      bullets: ["Staged temperature reduction", "Prevents internal material stress"],
      imgSrc: "assets/images/Fishnet.jpg" // Replace with actual image path
    },
    {
      title: "Automated Vacuum Sizing",
      desc: "Calibrators combined with vacuum technology ensure the exact outer diameter and wall thickness are achieved before the plastic fully solidifies.",
      bullets: ["Strict dimensional tolerances", "Continuous automated monitoring"],
      imgSrc: "assets/images/Fishnet.jpg" // Replace with actual image path
    },
    {
      title: "Rigorous Quality Control",
      desc: "In-line ultrasonic scanners continuously measure the 360-degree wall thickness, identifying and correcting any microscopic deviations in real-time.",
      bullets: ["Real-time ultrasonic scanning", "Zero-defect tolerance policy"],
      imgSrc: "assets/images/Fishnet.jpg" // Replace with actual image path
    },
    {
      title: "Automated Inkjet Marking",
      desc: "High-speed printers permanently mark every meter of the pipe with essential data including size, pressure rating, standards, and batch codes.",
      bullets: ["Permanent tracking data", "Clear, high-contrast printing"],
      imgSrc: "assets/images/Fishnet.jpg" // Replace with actual image path
    },
    {
      title: "Precision Planetary Cutting",
      desc: "Dust-free planetary saws automatically cut the continuous pipe into exact standard lengths or custom sizes without interrupting the extrusion line.",
      bullets: ["Smooth, chamfered edges", "Zero-dust operation"],
      imgSrc: "assets/images/Fishnet.jpg" // Replace with actual image path
    },
    {
      title: "Secure Storage & Packaging",
      desc: "Finished pipes are securely coiled or stacked using timber frames to prevent deformation during storage and ensure safe transit to the job site.",
      bullets: ["UV-protected storage yards", "Damage-free transit preparation"],
      imgSrc: "assets/images/Fishnet.jpg" // Replace with actual image path
    }
  ];

  if (processTabs.length > 0 && processTitle) {
    let currentProcessIndex = 0;

    // Helper function to update the DOM
    function updateProcessView(index) {
      const data = processData[index];
      
      // Update text
      processTitle.textContent = data.title;
      processDesc.textContent = data.desc;
      
      // Update bullets
      featureList.innerHTML = "";
      data.bullets.forEach(bullet => {
        const li = document.createElement("li");
        li.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" class="check-icon">
              <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clip-rule="evenodd" />
          </svg>
          ${bullet}
        `;
        featureList.appendChild(li);
      });

      // Update image
      processImg.src = data.imgSrc;

      // Update active tab styling
      processTabs.forEach(tab => tab.classList.remove("active"));
      processTabs[index].classList.add("active");

      // Scroll the active tab into view on mobile
      processTabs[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      
      currentProcessIndex = index;
    }

    // Tab Clicks
    processTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        updateProcessView(index);
      });
    });

    // Arrow Navigation Clicks
    if (processPrevBtn && processNextBtn) {
      processNextBtn.addEventListener("click", () => {
        const newIndex = (currentProcessIndex + 1) % processTabs.length;
        updateProcessView(newIndex);
      });

      processPrevBtn.addEventListener("click", () => {
        const newIndex = (currentProcessIndex - 1 + processTabs.length) % processTabs.length;
        updateProcessView(newIndex);
      });
    }
  }

});