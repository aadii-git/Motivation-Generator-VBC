/* ============================================================
   QUOTES DATA
   ============================================================ */
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your limitation — it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
];

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const quoteTextEl   = document.getElementById("quote-text");
const quoteAuthorEl = document.getElementById("quote-author");
const cardEl        = document.getElementById("quote-card");
const btnEl         = document.getElementById("generate-btn");
const copyBtn       = document.getElementById("copy-btn");
const shareBtn      = document.getElementById("share-btn");
const themeToggle   = document.getElementById("theme-toggle");
const themeIcon     = document.getElementById("theme-icon");
const toastEl       = document.getElementById("toast");
const loaderEl      = document.getElementById("loader");
const canvas        = document.getElementById("particles-canvas");

/* ============================================================
   STATE
   ============================================================ */
let lastIndex    = -1;
let currentQuote = null;
let toastTimer   = null;

/* ============================================================
   THEME TOGGLE
   ============================================================ */
function getStoredTheme() {
  return localStorage.getItem("motivation-theme") || "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
  localStorage.setItem("motivation-theme", theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  // Spin animation
  themeToggle.classList.add("is-toggling");
  setTimeout(() => themeToggle.classList.remove("is-toggling"), 500);

  applyTheme(next);
  showToast(next === "dark" ? "Dark mode enabled" : "Light mode enabled");
}

// Initialize theme
applyTheme(getStoredTheme());
themeToggle.addEventListener("click", toggleTheme);

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 2200);
}

/* ============================================================
   CORE LOGIC
   ============================================================ */

/**
 * Returns a random quote index that is different from the last one shown.
 */
function getRandomIndex() {
  let idx;
  do {
    idx = Math.floor(Math.random() * quotes.length);
  } while (idx === lastIndex && quotes.length > 1);
  lastIndex = idx;
  return idx;
}

/**
 * Animate out → show loader → swap content → shimmer → animate in.
 */
function generateQuote() {
  // Prevent rapid double-clicks
  btnEl.disabled = true;

  // Phase 1: animate out
  cardEl.classList.add("is-animating");

  // Phase 2: show loader
  setTimeout(() => {
    cardEl.classList.add("is-loading");
  }, 350);

  // Phase 3: after loading effect, swap content & animate in
  setTimeout(() => {
    const quote = quotes[getRandomIndex()];
    currentQuote = quote;

    quoteTextEl.textContent = `\u201C${quote.text}\u201D`;
    quoteAuthorEl.textContent = `— ${quote.author}`;

    // Remove loading and animating states
    cardEl.classList.remove("is-loading");
    cardEl.classList.remove("is-animating");

    // Trigger shimmer sweep
    cardEl.classList.add("is-shimmer");
    setTimeout(() => cardEl.classList.remove("is-shimmer"), 1100);

    btnEl.disabled = false;
  }, 1000);
}

/* ============================================================
   COPY QUOTE
   ============================================================ */
function copyQuote() {
  if (!currentQuote) return;

  const text = `"${currentQuote.text}" — ${currentQuote.author}`;

  navigator.clipboard.writeText(text).then(() => {
    // Success animation
    copyBtn.classList.add("is-success");
    const label = copyBtn.querySelector(".action-label");
    const origText = label.textContent;
    label.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.classList.remove("is-success");
      label.textContent = origText;
    }, 1800);

    showToast("Quote copied to clipboard ✓");
  }).catch(() => {
    showToast("Couldn't copy — try again");
  });
}

copyBtn.addEventListener("click", copyQuote);

/* ============================================================
   SHARE QUOTE
   ============================================================ */
function shareQuote() {
  if (!currentQuote) return;

  const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
  const shareData = {
    title: "Motivation Generator",
    text: shareText,
  };

  // Use Web Share API if available
  if (navigator.share) {
    navigator.share(shareData).then(() => {
      showToast("Shared successfully ✓");
    }).catch((err) => {
      // User cancelled — not an error
      if (err.name !== "AbortError") {
        showToast("Share failed");
      }
    });
  } else {
    // Fallback: copy to clipboard with share-friendly text
    const fallbackText = `${shareText}\n\n— via Motivation Generator`;
    navigator.clipboard.writeText(fallbackText).then(() => {
      shareBtn.classList.add("is-success");
      const label = shareBtn.querySelector(".action-label");
      const origText = label.textContent;
      label.textContent = "Copied!";

      setTimeout(() => {
        shareBtn.classList.remove("is-success");
        label.textContent = origText;
      }, 1800);

      showToast("Quote copied for sharing ✓");
    }).catch(() => {
      showToast("Couldn't share — try again");
    });
  }
}

shareBtn.addEventListener("click", shareQuote);

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
btnEl.addEventListener("click", generateQuote);

// Allow keyboard accessibility — Enter & Space already work on <button>,
// but also support pressing "G" as a shortcut.
document.addEventListener("keydown", (e) => {
  if (e.key === "g" || e.key === "G") {
    // Don't fire if user is typing in an input/textarea
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    generateQuote();
  }
});

// Show a random quote on first load
window.addEventListener("DOMContentLoaded", generateQuote);

/* ============================================================
   PARTICLE SYSTEM
   ============================================================ */
(function initParticles() {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function getParticleColor() {
    const theme = document.documentElement.getAttribute("data-theme");
    return theme === "light"
      ? "rgba(124, 58, 237, VAR)"
      : "rgba(163, 116, 255, VAR)";
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colorTemplate = getParticleColor();

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Pulse opacity
      const pulse = Math.sin(Date.now() * p.pulseSpeed + p.pulsePhase);
      const alpha = p.opacity + pulse * 0.15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = colorTemplate.replace("VAR", Math.max(0, alpha).toFixed(2));
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
    // Recalculate particle count on resize
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
    while (particles.length < count) particles.push(createParticle());
    while (particles.length > count) particles.pop();
  });

  init();
  draw();
})();
