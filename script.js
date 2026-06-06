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

const scrollTopBtn = document.getElementById("scrollTopBtn");
const aboutSection = document.getElementById("about");

window.addEventListener("scroll", () => {
  if (!aboutSection || !scrollTopBtn) return;

  const aboutTop = aboutSection.offsetTop;

  if (window.scrollY >= aboutTop - 120) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const gameBoard = document.getElementById("gameBoard");
const gameStatus = document.getElementById("gameStatus");
const resetGameBtn = document.getElementById("resetGameBtn");

let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const humanPlayer = "X";
const computerPlayer = "O";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function updateGameStatus(message) {
  if (gameStatus) {
    gameStatus.textContent = message;
  }
}

function getWinningCombination() {
  return winningCombinations.find(([a, b, c]) => {
    return (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    );
  });
}

function finishGameIfNeeded() {
  const winningCombination = getWinningCombination();

  if (winningCombination) {
    gameActive = false;

    winningCombination.forEach((winningIndex) => {
      const winningCell = gameBoard.querySelector(
        `[data-index="${winningIndex}"]`,
      );
      winningCell?.classList.add("winner");
    });

    const winner = boardState[winningCombination[0]];

    if (winner === humanPlayer) {
      updateGameStatus("You win!");
    } else {
      updateGameStatus("Computer wins!");
    }

    return true;
  }

  if (boardState.every(Boolean)) {
    gameActive = false;
    updateGameStatus("It's a draw!");
    return true;
  }

  return false;
}

function markCell(index, player) {
  const cell = gameBoard.querySelector(`[data-index="${index}"]`);

  if (!cell || boardState[index]) return;

  boardState[index] = player;
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
}

function getAvailableMoves() {
  return boardState
    .map((value, index) => (value === "" ? index : null))
    .filter((index) => index !== null);
}

function getSmartComputerMove() {
  const availableMoves = getAvailableMoves();

  // 1. Αν ο υπολογιστής μπορεί να κερδίσει, παίζει εκεί
  for (const move of availableMoves) {
    boardState[move] = computerPlayer;

    if (getWinningCombination()) {
      boardState[move] = "";
      return move;
    }

    boardState[move] = "";
  }

  // 2. Αν ο χρήστης πάει να κερδίσει, τον μπλοκάρει
  for (const move of availableMoves) {
    boardState[move] = humanPlayer;

    if (getWinningCombination()) {
      boardState[move] = "";
      return move;
    }

    boardState[move] = "";
  }

  // 3. Αν είναι ελεύθερο το κέντρο, το παίρνει
  if (boardState[4] === "") {
    return 4;
  }

  // 4. Μετά προτιμά γωνίες
  const corners = [0, 2, 6, 8].filter((index) => boardState[index] === "");

  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Αλλιώς παίζει τυχαία σε ό,τι έχει μείνει
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function makeComputerMove() {
  if (!gameActive) return;

  updateGameStatus("Thinking...");

  setTimeout(() => {
    const computerMove = getSmartComputerMove();

    if (computerMove === undefined) return;

    markCell(computerMove, computerPlayer);

    if (finishGameIfNeeded()) return;

    currentPlayer = humanPlayer;
    updateGameStatus("Your turn — X");
  }, 450);
}

function handleCellClick(event) {
  const cell = event.target.closest(".game-cell");

  if (!cell || !gameActive || currentPlayer !== humanPlayer) return;

  const index = Number(cell.dataset.index);

  if (boardState[index]) return;

  markCell(index, humanPlayer);

  if (finishGameIfNeeded()) return;

  currentPlayer = computerPlayer;
  makeComputerMove();
}

function resetGame() {
  boardState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = humanPlayer;
  gameActive = true;

  document.querySelectorAll(".game-cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "winner");
  });

  updateGameStatus("Your turn — X");
}

gameBoard?.addEventListener("click", handleCellClick);
resetGameBtn?.addEventListener("click", resetGame);
