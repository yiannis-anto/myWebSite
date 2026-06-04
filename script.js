const year = new Date().getFullYear();
const footer = document.querySelector(".footer p");

if (footer) {
  footer.textContent = `© ${year} Ioannis Antonogiannakis — Designed & built with care by Ioannis Antonogiannakis`;
}

/* Mobile sandwich menu */

const menuToggle = document.getElementById("menuToggle");
const navLinksContainer = document.getElementById("navLinks");

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navLinksContainer.classList.toggle("open");

    const isOpen = navLinksContainer.classList.contains("open");
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

/* Light / Dark theme - ONE button only */

const themeToggle = document.getElementById("desktopThemeToggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  html.setAttribute("data-theme", savedTheme);
} else {
  html.setAttribute("data-theme", "dark");
}

function updateThemeButton() {
  const currentTheme = html.getAttribute("data-theme");

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      currentTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme",
    );
  }
}

updateThemeButton();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);

    updateThemeButton();
  });
}

/* Active navbar item */

const sections = document.querySelectorAll(".section-observe");
const navLinks = document.querySelectorAll(".nav-link");

let isManualScrolling = false;
let manualScrollTimeout;

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${sectionId}`) {
      link.classList.add("active");
    }
  });
}

function updateActiveSectionOnScroll() {
  if (isManualScrolling) {
    return;
  }

  const header = document.querySelector(".header");
  const headerHeight = header ? header.offsetHeight : 100;

  const scrollPosition = window.scrollY + headerHeight + 80;
  const bottomPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;

  if (bottomPosition >= documentHeight - 20) {
    setActiveLink("contact");
    return;
  }

  let currentSectionId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;

    if (scrollPosition >= sectionTop) {
      currentSectionId = section.getAttribute("id");
    }
  });

  setActiveLink(currentSectionId);
}

window.addEventListener("scroll", updateActiveSectionOnScroll);
window.addEventListener("load", updateActiveSectionOnScroll);

/* Smooth scroll + close menu after click */

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) {
      return;
    }

    event.preventDefault();

    const sectionId = href.replace("#", "");
    const section = document.getElementById(sectionId);
    const header = document.querySelector(".header");

    if (!section || !header) {
      return;
    }

    const headerHeight = header.offsetHeight;
    const extraSpace = 18;

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      extraSpace;

    window.scrollTo({
      top: sectionTop,
      behavior: "smooth",
    });

    isManualScrolling = true;
    setActiveLink(sectionId);

    clearTimeout(manualScrollTimeout);

    manualScrollTimeout = setTimeout(() => {
      isManualScrolling = false;
      updateActiveSectionOnScroll();
    }, 900);
    if (menuToggle && navLinksContainer) {
      menuToggle.classList.remove("open");
      navLinksContainer.classList.remove("open");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });
});

/* Close mobile menu when clicking outside */

document.addEventListener("click", (event) => {
  if (!menuToggle || !navLinksContainer) {
    return;
  }

  const clickedInsideMenu = navLinksContainer.contains(event.target);
  const clickedMenuButton = menuToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedMenuButton) {
    menuToggle.classList.remove("open");
    navLinksContainer.classList.remove("open");
    menuToggle.setAttribute("aria-label", "Open menu");
  }
});
