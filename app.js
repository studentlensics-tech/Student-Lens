// ==============================================
// app.js — Student Lens
// ==============================================
//
// LEGEND / SECTIONS
// -----------------
// [A] Firebase Setup (shared everywhere)
// [B] Shared Helpers (date, header UI, profile UI)
// [C] Page Detection
// [D] Login Page Logic
// [E] Index Page Logic
// [F] Account Page Logic
// [G] Role Handling (future-ready placeholder)
// [H] Boot / Page Routing
//
// ==============================================


// [A] Firebase Setup
// ----------------------------------------------
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
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

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function authReady() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => { unsub(); resolve(u); });
  });
}


// [B] Shared Helpers
// ----------------------------------------------
function setDate() {
  const el = document.getElementById("currentDate") || document.getElementById("top-date");
  if (!el) return;
  const d = new Date();
  el.textContent = d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

function showProfileUI(user) {
  const nameEl = document.getElementById("profile-name");
  const picEl  = document.getElementById("profile-pic");
  if (nameEl) nameEl.textContent = user.displayName || user.email;
  if (picEl)  picEl.src = user.photoURL || "img/IcsBuilding.jpg";
}

function wireHeader(user) {
  // dropdown
  const profileBtn   = document.getElementById("Profile-btn");
  const dropdownMenu = document.getElementById("profileDropdown");

  if (profileBtn && dropdownMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("active");
    });
    document.addEventListener("click", () => dropdownMenu.classList.remove("active"));
  }

  // account
  const accountBtn = document.getElementById("accountBtn");
  if (accountBtn) accountBtn.addEventListener("click", () => location.href = "account.html");

  // logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    location.replace("login.html");
  });
}


// [C] Page Detection
// ----------------------------------------------
function isLoginPage()   { return !!document.getElementById("logInBtn"); }
function isIndexPage()   { return !!document.getElementById("main-screen"); }
function isAccountPage() { return !!document.getElementById("account-page"); }


// [D] Login Page Logic
// ----------------------------------------------
function wireLoginPage() {
  const signUpBtn = document.getElementById("signUpBtn");
  const logInBtn  = document.getElementById("logInBtn");
  const msgEl     = document.getElementById("auth-message");

  async function doSignIn(mode) {
    try {
      const res = await signInWithPopup(auth, provider);
      const u = res.user;
      const domain = (u.email || "").split("@")[1];
      if (domain !== "icsz.ch") {
        alert("Use your school email (@icsz.ch).");
        await signOut(auth);
        return;
      }
      if (msgEl) msgEl.textContent = mode === "signup" ? `Welcome, ${u.displayName}!` : `Welcome back, ${u.displayName}!`;
      location.replace("index.html");
    } catch (err) {
      console.error(err);
      if (msgEl) msgEl.textContent = "Sign-in failed.";
    }
  }

  signUpBtn?.addEventListener("click", () => doSignIn("signup"));
  logInBtn?.addEventListener("click", () => doSignIn("login"));
}


// [E] Index Page Logic
// ----------------------------------------------
function wireIndexPage(user) {
  const main = document.getElementById("main-screen");
  if (main) main.style.display = "block";

  showProfileUI(user);
  wireHeader(user);
  setDate();

  // Example: search bar / announcements wiring can go here later
  console.log("Index page ready for", user.email);
}


// [F] Account Page Logic
// ----------------------------------------------
function wireAccountPage(user) {
  const acc = document.getElementById("account-page");
  if (acc) acc.style.display = "block";

  showProfileUI(user);
  wireHeader(user);
  setDate();

  // Example: role-based options will be plugged in here
  console.log("Account page ready for", user.email);
}

// [G] Role Handling (future placeholder)
// ----------------------------------------------
// Here you can check custom claims from Firebase or Firestore roles.
// Example:
//   if (userRole === "admin") { showAdminUI(); }
//   else if (userRole === "student") { showStudentUI(); }


// [H] Boot / Page Routing
// ----------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const user = await authReady();

  if (isLoginPage()) {
    if (user) return location.replace("index.html");
    return wireLoginPage();
  }

  if (isIndexPage()) {
    if (!user) return location.replace("login.html");
    return wireIndexPage(user);
  }

  if (isAccountPage()) {
    if (!user) return location.replace("login.html");
    return wireAccountPage(user);
  }
});
