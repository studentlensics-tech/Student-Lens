// =============================
// Firebase Setup
// =============================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsGS-W7EZ_ZX7Cgv_ZxwOLZkp-u8ilaRQ",
  authDomain: "studentlensics-4369f.firebaseapp.com",
  projectId: "studentlensics-4369f",
  storageBucket: "studentlensics-4369f.firebasestorage.app",
  messagingSenderId: "792919091240",
  appId: "1:792919091240:web:31ae2869ddd8b0d28cad1d",
  measurementId: "G-V3YBM8DZXW",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// =============================
// UI helpers
// =============================
function showMainScreen(user) {
  const authScreen = document.getElementById("auth-screen");
  const mainScreen = document.getElementById("main-screen");

  if (authScreen) authScreen.style.display = "none";
  if (mainScreen) mainScreen.style.display = "block";

  const profileName = document.getElementById("profile-name");
  const profilePic = document.getElementById("profile-pic");

  if (profileName) profileName.textContent = user.displayName || user.email;
  if (profilePic) profilePic.src = user.photoURL || "img/IcsBuilding.jpg";
}

function showAuthScreen() {
  const authScreen = document.getElementById("auth-screen");
  const mainScreen = document.getElementById("main-screen");

  if (authScreen) authScreen.style.display = "flex";
  if (mainScreen) mainScreen.style.display = "none";
}

// =============================
// Auth handlers
// =============================
function handleSignIn(mode) {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;

      // Enforce school domain
      const domain = user.email.split("@")[1];
      if (domain !== "icsz.ch") {
        alert("You must use your school email.");
        signOut(auth);
        return;
      }

      // Let onAuthStateChanged handle UI
      document.getElementById("auth-message").textContent =
        mode === "signup"
          ? `Welcome, ${user.displayName}! Account created.`
          : `Welcome back, ${user.displayName}!`;
    })
    .catch((error) => {
      console.error(`${mode} error:`, error.message);
    });
}

function handleSignOut() {
  signOut(auth)
    .then(() => {
      showAuthScreen(); // fallback in case onAuthStateChanged is late
    })
    .catch((err) => console.error("Sign out error:", err.message));
}

// =============================
// DOM Ready
// =============================
document.addEventListener("DOMContentLoaded", () => {
  // Auth buttons
  const signUpBtn = document.getElementById("signUpBtn");
  const logInBtn = document.getElementById("logInBtn");
  if (signUpBtn) signUpBtn.addEventListener("click", () => handleSignIn("signup"));
  if (logInBtn) logInBtn.addEventListener("click", () => handleSignIn("login"));

  // Profile dropdown
  const profileBtn = document.getElementById("Profile-btn");
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

  // Account page link
  const accountBtn = document.getElementById("accountBtn");
  if (accountBtn) {
    accountBtn.addEventListener("click", () => {
      if (!window.location.pathname.endsWith("account.html")) {
        window.location.href =
          "https://studentlensics-tech.github.io/Student-Lens/account.html";
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      handleSignOut();
      if (dropdownMenu) dropdownMenu.classList.remove("active");
      if (profileBtn) profileBtn.setAttribute("aria-expanded", "false");
    });
  }

  // Home button
  const homeLink = document.getElementById("homeLink");
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (auth.currentUser) {
        showMainScreen(auth.currentUser);
        document
          .getElementById("main-screen")
          .scrollIntoView({ behavior: "smooth" });
      } else {
        showAuthScreen();
      }
    });
  }

  // Date
  updateTopDate();
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  setTimeout(() => {
    updateTopDate();
    setInterval(updateTopDate, 24 * 60 * 60 * 1000);
  }, nextMidnight - now);
});

// =============================
// Auth state persistence
// =============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    showMainScreen(user);
  } else {
    showAuthScreen();
  }
});

// =============================
// Header date
// =============================
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function formatTopDate(d) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${ordinal(d.getDate())} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}
function updateTopDate() {
  const el = document.getElementById("top-date");
  if (el) el.textContent = formatTopDate(new Date());
}
