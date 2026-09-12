document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");

  const updateNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 30
    );
  };

  updateNavbar();

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );


  const closeMenu = () => {

    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("active");

    navLinks.classList.remove("active");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Open menu"
    );

    document.body.classList.remove("menu-open");
  };


  const openMenu = () => {

    if (!menuToggle || !navLinks) return;

    menuToggle.classList.add("active");

    navLinks.classList.add("active");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Close menu"
    );

    document.body.classList.add("menu-open");
  };


  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", (event) => {

      event.stopPropagation();

      if (
        navLinks.classList.contains("active")
      ) {
        closeMenu();
      } else {
        openMenu();
      }

    });


    navItems.forEach((link) => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


    document.addEventListener("click", (event) => {

      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }

    });


    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });


    window.addEventListener("resize", () => {

      if (window.innerWidth > 850) {
        closeMenu();
      }

    });

  }


  /* =====================================================
     ACTIVE SECTION
  ===================================================== */

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window) {

    const sectionObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            navItems.forEach((link) => {

              const target =
                link.getAttribute("href");

              link.classList.toggle(
                "active",
                target === `#${entry.target.id}`
              );

            });

          });

        },
        {
          rootMargin:
            "-38% 0px -55% 0px"
        }
      );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

  }


  /* =====================================================
     REVEAL ANIMATION
  ===================================================== */

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("show");

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold:0.1
        }
      );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("show");
    });

  }


  /* =====================================================
     FOCUS STOPWATCH
  ===================================================== */

  const focusTimer =
    document.getElementById("focusTimer");

  const startTimer =
    document.getElementById("startTimer");

  const pauseTimer =
    document.getElementById("pauseTimer");

  const resetTimer =
    document.getElementById("resetTimer");

  const timerCircle =
    document.getElementById("timerCircle");


  let elapsedSeconds = 0;

  let timerInterval = null;

  let timerStartTime = null;


  const formatTime = (seconds) => {

    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    return [
      hours,
      minutes,
      secs
    ]
      .map((value) =>
        String(value).padStart(2, "0")
      )
      .join(":");
  };


  const updateTimer = () => {

    if (!focusTimer) return;

    focusTimer.textContent =
      formatTime(elapsedSeconds);

  };


  const updateButtons = (running) => {

    if (startTimer) {

      startTimer.disabled =
        running;

      const text =
        startTimer.querySelector(
          "span"
        );

      const icon =
        startTimer.querySelector(
          "b"
        );

      if (text) {

        text.textContent =
          running
            ? "RUNNING"
            : elapsedSeconds > 0
              ? "RESUME"
              : "START";

      }

      if (icon) {

        icon.textContent =
          running
            ? "●"
            : "▶";

      }

    }


    if (pauseTimer) {
      pauseTimer.disabled =
        !running;
    }


    if (timerCircle) {

      timerCircle.classList.toggle(
        "running",
        running
      );

    }

  };


  const startStopwatch = () => {

    if (timerInterval !== null) {
      return;
    }

    timerStartTime =
      Date.now() -
      elapsedSeconds * 1000;


    timerInterval =
      setInterval(() => {

        elapsedSeconds =
          Math.floor(
            (
              Date.now() -
              timerStartTime
            ) / 1000
          );

        updateTimer();

      }, 250);


    updateButtons(true);

  };


  const pauseStopwatch = () => {

    if (timerInterval === null) {
      return;
    }

    clearInterval(timerInterval);

    timerInterval = null;

    elapsedSeconds =
      Math.floor(
        (
          Date.now() -
          timerStartTime
        ) / 1000
      );

    updateTimer();

    updateButtons(false);

  };


  const resetStopwatch = () => {

    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }

    timerInterval = null;

    elapsedSeconds = 0;

    timerStartTime = null;

    updateTimer();

    updateButtons(false);

  };


  startTimer?.addEventListener(
    "click",
    startStopwatch
  );

  pauseTimer?.addEventListener(
    "click",
    pauseStopwatch
  );

  resetTimer?.addEventListener(
    "click",
    resetStopwatch
  );


  updateTimer();

  updateButtons(false);


  /* =====================================================
     CONTACT FORM
  ===================================================== */

  const contactForm =
    document.getElementById("contactForm");

  const formStatus =
    document.getElementById("formStatus");

  const submitBtn =
    document.getElementById("submitBtn");


  contactForm?.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (!formStatus || !submitBtn) {
        return;
      }


      const name =
        document.getElementById("name")
          ?.value
          .trim();

      const email =
        document.getElementById("email")
          ?.value
          .trim();

      const phone =
        document.getElementById("phone")
          ?.value
          .trim();

      const message =
        document.getElementById("message")
          ?.value
          .trim();


      if (!name || !email || !message) {

        formStatus.textContent =
          "Please complete all required fields.";

        formStatus.className =
          "form-status error";

        return;
      }


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (!emailPattern.test(email)) {

        formStatus.textContent =
          "Please enter a valid email address.";

        formStatus.className =
          "form-status error";

        return;
      }


      submitBtn.classList.add("loading");

      submitBtn.disabled = true;

      formStatus.textContent =
        "Sending your message...";

      formStatus.className =
        "form-status";


      try {

        const response =
          await fetch(
            "/api/contact",
            {
              method:"POST",

              headers:{
                "Content-Type":
                  "application/json"
              },

              body:JSON.stringify({
                name,
                email,
                phone,
                message
              })
            }
          );


        let data = {};

        try {
          data =
            await response.json();
        } catch (_) {}


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to send message."
          );

        }


        formStatus.textContent =
          data.message ||
          "Message sent successfully.";

        formStatus.className =
          "form-status success";


        contactForm.reset();


      } catch (error) {

        console.error(
          "Contact form error:",
          error
        );


        formStatus.textContent =
          "Unable to send right now. Please email nirmalk8009@gmail.com directly.";

        formStatus.className =
          "form-status error";

      } finally {

        submitBtn.classList.remove(
          "loading"
        );

        submitBtn.disabled = false;

      }

    }
  );


  /* =====================================================
     IMAGE ERROR HANDLING
  ===================================================== */

  document
    .querySelectorAll("img")
    .forEach((image) => {

      image.addEventListener(
        "error",
        () => {

          image.style.opacity = ".2";

          console.warn(
            "Image could not be loaded:",
            image.src
          );

        },
        { once:true }
      );

    });


  /* =====================================================
     YEAR
  ===================================================== */

  const year =
    document.getElementById(
      "currentYear"
    );

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

});