// =============================
// Firebase Setup
// =============================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsGS-W7EZ_ZX7Cgv_ZxwOLZkp-u8ilaRQ",
  authDomain: "studentlensics-4369f.firebaseapp.com",
  projectId: "studentlensics-4369f",
  storageBucket: "studentlensics-4369f.firebasestorage.app",
  messagingSenderId: "792919091240",
  appId: "1:792919091240:web:31ae2869ddd8b0d28cad1d",
  measurementId: "G-V3YBM8DZXW"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

// =============================
// UI helpers
// =============================
function showMainScreen(user) {
  const mainScreen = document.getElementById("main-screen");
  if (mainScreen) {
    mainScreen.style.display = "block";
  }
  const profileName = document.getElementById("profile-name");
  if (profileName) {
    profileName.textContent = user.displayName || user.email;
  }
  const profilePic = document.getElementById("profile-pic");
  if (profilePic) {
    profilePic.src = user.photoURL || "img/IcsBuilding.jpg";
  }
}

// =============================
// DOM Ready
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn   = document.getElementById("Profile-btn");
  const dropdownMenu = document.getElementById("profileDropdown");

  if (profileBtn && dropdownMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.toggle("active");
      profileBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("active");
      profileBtn.setAttribute("aria-expanded", "false");
    });
  }

  const accountBtn = document.getElementById("accountBtn");
  if (accountBtn) {
    accountBtn.addEventListener("click", () => {
      window.location.href = "account.html";
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).catch((err) => console.error("Sign out error:", err.message));
    });
  }

  const homeLink = document.getElementById("homeLink");
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("main-screen")?.scrollIntoView({ behavior: "smooth" });
    });
  }
});

// =============================
// Auth state persistence
// =============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ User logged in → showing main screen");
    showMainScreen(user);
  } else {
    console.log("⛔ No user → redirecting to login");
    location.replace("login.html");
  }
});

// =============================
// Header date
// =============================
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function formatTopDate(d) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${ordinal(d.getDate())} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}
function updateTopDate() {
  const el = document.getElementById("top-date");
  if (el) el.textContent = formatTopDate(new Date());
}
document.addEventListener("DOMContentLoaded", () => {
  updateTopDate();
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  setTimeout(() => {
    updateTopDate();
    setInterval(updateTopDate, 24 * 60 * 60 * 1000);
  }, nextMidnight - now);
});
