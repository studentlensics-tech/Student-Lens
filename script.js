// =============================
// Firebase (shared config)
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

const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for Firebase to finish restoring session (prevents loops)
function authReady() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => { unsub(); resolve(u); });
  });
}

// =============================
// UI helpers
// =============================
function showMainScreen(user) {
  const main = document.getElementById("main-screen");
  if (main) main.style.display = "block";

  const nameEl = document.getElementById("profile-name");
  const picEl  = document.getElementById("profile-pic");
  if (nameEl) nameEl.textContent = user.displayName || user.email || "Account";
  if (picEl)  picEl.src = user.photoURL || "img/IcsBuilding.jpg";
}

function redirectToLogin() {
  // replace() avoids back-button war
  location.replace("login.html");
}

// =============================
// Page boot
// =============================
document.addEventListener("DOMContentLoaded", async () => {
  // Decide only after Firebase is ready
  const user = await authReady();
  if (!user) {
    redirectToLogin();
    return;
  }

  // We are signed in → render UI + handlers
  showMainScreen(user);

  // Profile dropdown
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

  // Account page
  document.getElementById("accountBtn")?.addEventListener("click", () => {
    location.href = "account.html";
  });

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    signOut(auth).catch((err) => console.error("Sign out error:", err));
  });

  // Home button (no nav away; just scroll)
  document.getElementById("homeLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("main-screen")?.scrollIntoView({ behavior: "smooth" });
  });

  // Header date (supports either id you've used)
  const dateEl = document.getElementById("currentDate") || document.getElementById("top-date");
  if (dateEl) {
    const update = () => {
      const d = new Date();
      dateEl.textContent = d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    };
    update();
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    setTimeout(() => {
      update();
      setInterval(update, 24 * 60 * 60 * 1000);
    }, nextMidnight - now);
  }

  // Also react to future auth changes (e.g., logout)
  onAuthStateChanged(auth, (u) => {
    if (!u) redirectToLogin();
  });
});
