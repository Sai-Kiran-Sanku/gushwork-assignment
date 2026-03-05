document.addEventListener("DOMContentLoaded", function () {
  // --- 1. Sticky Header Logic [cite: 9, 10, 12] ---
  const stickyHeader = document.getElementById("stickyHeader");
  const heroSection = document.querySelector(".hero");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 500;

    // Show header only after scrolling beyond the first fold
    if (currentScroll > heroHeight) {
      // Show when scrolling up, hide when scrolling down (typical modern UX)
      if (currentScroll < lastScrollY) {
        stickyHeader.classList.add("active");
      } else {
        stickyHeader.classList.remove("active");
      }
    } else {
      stickyHeader.classList.remove("active");
    }
    lastScrollY = currentScroll;
  });

  // --- 2. Gallery / zoom initialization ---
  const mainImage = document.getElementById('mainImage');
  const zoomContainer = document.getElementById('zoomContainer');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;

  // only proceed if required elements exist
  if (mainImage && zoomContainer && thumbnails.length > 0 && prevBtn && nextBtn) {
    console.log('gallery init:', { mainImage, thumbnailsCount: thumbnails.length, prevBtn, nextBtn });
    const zoomResult = document.getElementById('zoomResult');
    // 1. Zoom Functionality [cite: 16, 17, 38]
    zoomContainer.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = zoomContainer.getBoundingClientRect();
      const x = ((e.pageX - left - window.scrollX) / width) * 100;
      const y = ((e.pageY - top - window.scrollY) / height) * 100;

      // show external zoom box
      if (zoomResult) {
        zoomResult.style.display = 'block';
        zoomResult.style.backgroundImage = `url('${mainImage.src}')`;
        // background-position: move opposite direction
        zoomResult.style.backgroundPosition = `${x}% ${y}%`;
      }

      // still keep the internal hover zoom for small screens
      mainImage.style.transformOrigin = `${x}% ${y}%`;
      mainImage.style.transform = "scale(2)";
    });

    zoomContainer.addEventListener('mouseleave', () => {
      mainImage.style.transform = "scale(1)";
      mainImage.style.transformOrigin = "center center";
      if (zoomResult) zoomResult.style.display = 'none';
    });

    const updateGallery = (index) => {
      console.log('updateGallery called with', index);
      currentIndex = index;
      // fade-out, switch src, then fade-in
      mainImage.style.opacity = 0;
      setTimeout(() => {
        mainImage.src = thumbnails[currentIndex].src;
        mainImage.style.opacity = 1;
      }, 200); // match half of CSS transition duration

      thumbnails.forEach(t => t.classList.remove('active'));
      thumbnails[currentIndex].classList.add('active');
      thumbnails[currentIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    };

    prevBtn.addEventListener('click', () => {
      let newIndex = currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1;
      updateGallery(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      let newIndex = (currentIndex + 1) % thumbnails.length;
      updateGallery(newIndex);
    });

    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => updateGallery(index));
    });

    // ensure gallery shows first thumbnail initially
    updateGallery(0);
  }

  // --- 2B. Section 5 Card Image Zoom (similar to Section 1) ---
  const s5CardImages = document.querySelectorAll(".app-card-img");
  const canHoverZoom = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (s5CardImages.length > 0 && canHoverZoom) {
    const s5ZoomPreview = document.createElement("div");
    s5ZoomPreview.id = "s5ZoomPreview";
    document.body.appendChild(s5ZoomPreview);

    const showS5Zoom = (img, clientX, clientY) => {
      const rect = img.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      s5ZoomPreview.style.display = "block";
      s5ZoomPreview.style.backgroundImage = `url('${img.currentSrc || img.src}')`;
      s5ZoomPreview.style.backgroundPosition = `${x}% ${y}%`;

      const previewWidth = 260;
      const offset = 18;
      const placeLeft = rect.right + previewWidth + offset > window.innerWidth;

      if (placeLeft) {
        s5ZoomPreview.style.left = `${Math.max(12, rect.left - previewWidth - offset)}px`;
      } else {
        s5ZoomPreview.style.left = `${Math.min(window.innerWidth - previewWidth - 12, rect.right + offset)}px`;
      }

      s5ZoomPreview.style.top = `${Math.max(12, Math.min(window.innerHeight - 272, rect.top))}px`;

      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = "scale(1.8)";
    };

    const hideS5Zoom = (img) => {
      s5ZoomPreview.style.display = "none";
      img.style.transform = "scale(1)";
      img.style.transformOrigin = "center center";
    };

    s5CardImages.forEach((img) => {
      img.addEventListener("mousemove", (event) => showS5Zoom(img, event.clientX, event.clientY));
      img.addEventListener("mouseenter", (event) => showS5Zoom(img, event.clientX, event.clientY));
      img.addEventListener("mouseleave", () => hideS5Zoom(img));
    });
  }



  // --- 3. Section 5 Horizontal Slider Logic ---

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
  const processImageContainer = document.querySelector(".process-image-container");
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
      imgSrc: "assets/images/Fishnet.jpg" 
    },
    {
      title: "Secure Storage & Packaging",
      desc: "Finished pipes are securely coiled or stacked using timber frames to prevent deformation during storage and ensure safe transit to the job site.",
      bullets: ["UV-protected storage yards", "Damage-free transit preparation"],
      imgSrc: "assets/images/Fishnet.jpg" 
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

      // Update image with fade effect
      if (processImg) {
        processImg.style.opacity = "0";
        setTimeout(() => {
          processImg.src = data.imgSrc;
          processImg.style.opacity = "1";
        }, 300); // matches CSS transition duration
      }

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

  if (processImg && processImageContainer && canHoverZoom) {
    const processZoomPreview = document.createElement("div");
    processZoomPreview.id = "processZoomPreview";
    document.body.appendChild(processZoomPreview);

    const showProcessZoom = (clientX, clientY) => {
      const rect = processImg.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      processImageContainer.style.setProperty("--trace-x", `${x}%`);
      processImageContainer.style.setProperty("--trace-y", `${y}%`);
      processImageContainer.classList.add("zoom-active");

      processZoomPreview.style.display = "block";
      processZoomPreview.style.backgroundImage = `url('${processImg.currentSrc || processImg.src}')`;
      processZoomPreview.style.backgroundPosition = `${x}% ${y}%`;

      const previewWidth = 280;
      const offset = 18;
      const placeLeft = rect.right + previewWidth + offset > window.innerWidth;

      if (placeLeft) {
        processZoomPreview.style.left = `${Math.max(12, rect.left - previewWidth - offset)}px`;
      } else {
        processZoomPreview.style.left = `${Math.min(window.innerWidth - previewWidth - 12, rect.right + offset)}px`;
      }

      processZoomPreview.style.top = `${Math.max(12, Math.min(window.innerHeight - 292, rect.top))}px`;
      processImg.style.transformOrigin = `${x}% ${y}%`;
      processImg.style.transform = "scale(1.7)";
      processImg.style.filter = "saturate(1.05) contrast(1.05)";
    };

    const hideProcessZoom = () => {
      processImageContainer.classList.remove("zoom-active");
      processZoomPreview.style.display = "none";
      processImg.style.transform = "scale(1)";
      processImg.style.transformOrigin = "center center";
      processImg.style.filter = "";
    };

    processImg.addEventListener("mousemove", (event) => showProcessZoom(event.clientX, event.clientY));
    processImg.addEventListener("mouseenter", (event) => showProcessZoom(event.clientX, event.clientY));
    processImg.addEventListener("mouseleave", hideProcessZoom);
  }

  // --- 5. Quote Modal ---
  const quoteModalTriggers = Array.from(
    document.querySelectorAll("[data-quote-modal-trigger='true']")
  );
  const quoteModal = document.getElementById("quoteModal");
  const quoteModalCard = quoteModal ? quoteModal.querySelector(".modal-card") : null;
  const closeQuoteModalBtn = document.getElementById("closeQuoteModal");
  const quoteEmailInput = document.getElementById("quoteEmail");
  const downloadBrochureBtn = document.getElementById("downloadBrochureBtn");
  let lastFocusedElement = null;

  if (quoteModalTriggers.length > 0 && quoteModal && quoteModalCard && closeQuoteModalBtn && quoteEmailInput && downloadBrochureBtn) {
    const getModalFocusableElements = () =>
      Array.from(
        quoteModal.querySelectorAll(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
      ).filter((el) => !el.hasAttribute("disabled"));

    const openQuoteModal = () => {
      lastFocusedElement = document.activeElement;
      quoteModal.classList.add("active");
      quoteModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      quoteEmailInput.focus();
    };

    const closeQuoteModal = () => {
      quoteModal.classList.remove("active");
      quoteModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    };

    const updateDownloadState = () => {
      downloadBrochureBtn.disabled = !quoteEmailInput.checkValidity();
    };

    quoteModalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openQuoteModal();
      });
    });

    closeQuoteModalBtn.addEventListener("click", closeQuoteModal);

    quoteModal.addEventListener("click", (event) => {
      if (event.target === quoteModal) {
        closeQuoteModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!quoteModal.classList.contains("active")) {
        return;
      }

      if (event.key === "Escape") {
        closeQuoteModal();
        return;
      }

      if (event.key === "Tab") {
        const focusable = getModalFocusableElements();
        if (focusable.length === 0) {
          event.preventDefault();
          quoteModalCard.focus();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    });

    quoteEmailInput.addEventListener("input", updateDownloadState);
    updateDownloadState();
  }

});
