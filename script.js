// =============================
// FIREBASE SHARED CONFIG
// =============================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

function currentPage() {
  return window.location.pathname.split("/").pop(); // e.g. "login.html"
}

// =============================
// GLOBAL OAUTH HELPERS
// =============================
function handleSignIn(mode) {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const u = result.user;
      const domain = (u.email || "").split("@")[1];
      if (domain !== "icsz.ch") {
        alert("You must use your school email.");
        return signOut(auth);
      }
      location.replace("index.html");
    })
    .catch((err) => console.error(`${mode} error:`, err));
}

function handleSignOut() {
  return signOut(auth).catch((err) => console.error("Sign out error:", err));
}

// =============================
// AUTH ROUTER
// =============================
onAuthStateChanged(auth, (user) => {
  const page = currentPage();

  if (!user) {
    if (page !== "login.html") {
      console.log("⛔ Not logged in → redirecting to login");
      location.replace("login.html");
    }
  } else {
    if (page === "login.html") {
      console.log("✅ Already logged in → redirecting to app");
      location.replace("index.html");
    } else {
      console.log("✅ Logged in as:", user.email);
      setupPage(page, user);
    }
  }
});

// =============================
// PAGE BOOTSTRAP
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const page = currentPage();

  if (page === "login.html") initLoginPage();
  if (page === "index.html") initIndexPageUI();
  if (page === "account.html") initAccountPageUI();
});

// =============================
// LOGIN PAGE SECTION
// =============================
function initLoginPage() {
  console.log("📄 Login page ready");
  document.getElementById("signUpBtn")?.addEventListener("click", () => handleSignIn("signup"));
  document.getElementById("logInBtn")?.addEventListener("click", () => handleSignIn("login"));
}

// =============================
// INDEX PAGE SECTION
// =============================
function initIndexPageUI() {
  console.log("📄 Index page UI setup");

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

  document.getElementById("accountBtn")?.addEventListener("click", () => {
    location.href = "account.html";
  });

  document.getElementById("logoutBtn")?.addEventListener("click", handleSignOut);

  document.getElementById("homeLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("main-screen")?.scrollIntoView({ behavior: "smooth" });
  });

  // date header
  updateTopDate();
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  setTimeout(() => {
    updateTopDate();
    setInterval(updateTopDate, 24 * 60 * 60 * 1000);
  }, nextMidnight - now);
}

function setupPage(page, user) {
  if (page === "index.html") {
    // show main screen
    document.getElementById("main-screen").style.display = "block";
    document.getElementById("profile-name").textContent = user.displayName || user.email;
    const pic = document.getElementById("profile-pic");
    if (pic) pic.src = user.photoURL || "img/IcsBuilding.jpg";
  }

  if (page === "account.html") {
    document.getElementById("account-email").textContent = user.email;
  }
}

// =============================
// ACCOUNT PAGE SECTION
// =============================
function initAccountPageUI() {
  console.log("📄 Account page UI setup");
  document.getElementById("logoutBtn")?.addEventListener("click", handleSignOut);
}

// =============================
// DATE HELPERS
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
