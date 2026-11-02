// ================= GLOBAL REWARD STATE =================

// Initialize rewards if not present
if (!localStorage.getItem("auraRewardPoints")) {
  localStorage.setItem("auraRewardPoints", "0");
}

// Get rewards
function getRewardPoints() {
  return Number(localStorage.getItem("auraRewardPoints"));
}

// Add rewards
function addRewardPoints(points) {
  const current = getRewardPoints();
  const updated = current + points;
  localStorage.setItem("auraRewardPoints", updated);
  return updated;
}

/* ================= Franchise Recommendations ================= */

const franchiseRecommendations = [
  {
    id: 1,
    type: "Franchise",
    title: "FitZone Gym",
    location: "Bengaluru",
    investment: "₹30L – ₹40L",
    image: "./assets/gym.jpg"
  },
  {
    id: 2,
    type: "Franchise",
    title: "Urban Brew Café",
    location: "Hyderabad",
    investment: "₹15L – ₹25L",
    image: "./assets/cafe.jpg"
  },
  {
    id: 3,
    type: "Collaboration",
    title: "South India Cloud Kitchen",
    location: "Bengaluru",
    investment: "₹12L",
    image: "./assets/cloud-kitchen.jpg"
  }
];

function renderFranchiseRecommendations() {
  const list = document.getElementById("recommendationsList");
  if (!list) return;

  list.innerHTML = "";

  franchiseRecommendations.forEach(item => {
    list.innerHTML += `
      <div class="card">
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Investment:</strong> ${item.investment}</p>
        <button class="btn-outline">View Details</button>
      </div>
    `;
  });
}

/* ================= Rewards → Crypto ================= */

function renderRewardsCrypto() {
  const rewardPoints = getRewardPoints();

  const rewardEl = document.getElementById("rewardPoints");
  const cryptoEl = document.getElementById("cryptoValue");
  const fiatEl = document.getElementById("fiatValue");
  const lockedEl = document.getElementById("cryptoLocked");
  const unlockedEl = document.getElementById("cryptoUnlocked");

  if (rewardEl) {
    rewardEl.textContent = `${rewardPoints} pts`;
  }

  const INR_PER_POINT = 1;
  const BTC_RATE = 4200000;

  if (rewardPoints > 0 && cryptoEl && fiatEl) {
    const inrValue = rewardPoints * INR_PER_POINT;
    const btcValue = inrValue / BTC_RATE;

    if (lockedEl) lockedEl.style.display = "none";
    if (unlockedEl) unlockedEl.style.display = "block";

    fiatEl.textContent = `≈ ₹${inrValue.toLocaleString()}`;
    cryptoEl.textContent = `${btcValue.toFixed(6)} BTC`;
  } else {
    if (lockedEl) lockedEl.style.display = "block";
    if (unlockedEl) unlockedEl.style.display = "none";
  }
}

/* ================= NAV TOGGLE ================= */

function initNavToggle() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    navToggle.classList.toggle("active");
  });
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  renderFranchiseRecommendations();
  renderRewardsCrypto();
  initNavToggle();
  updateAuthUI();
});


/* ================= AUTH UI ================= */
function updateAuthUI() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("aura_user") || "null");
  } catch {
    user = null;
  }

  const loginLink = document.getElementById("loginLink");
  const profileLink = document.getElementById("profileLink");
  if (loginLink) loginLink.style.display = user ? "none" : "";
  if (profileLink) profileLink.style.display = user ? "" : "none";

  const profileHeading = document.querySelector(".profile-header h2");
  const profileEmail = document.querySelector(".profile-header p");
  if (profileHeading) profileHeading.textContent = user?.name || "Guest User";
  if (profileEmail) profileEmail.textContent = user?.email || "No account is currently signed in";
  const profileName = document.getElementById("profileName");
  if (profileName) profileName.textContent = user?.name || "Guest User";
  const profilePoints = document.getElementById("profileRewardPoints");
  if (profilePoints) profilePoints.textContent = String(getRewardPoints());

  const avatar = document.getElementById("headerProfileAvatar");
  if (avatar) avatar.alt = user ? `Profile for ${user.name}` : "Profile";
}

