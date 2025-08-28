// =============================
// Firebase Setup
// =============================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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

// =============================
// Handle login
// =============================
function handleSignIn(mode) {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const domain = user.email.split("@")[1];
      if (domain !== "icsz.ch") {
        alert("You must use your school email.");
        signOut(auth);
        return;
      }
      // Redirect to main app after success
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error(`${mode} error:`, error.message);
    });
}

// =============================
// DOM Ready
// =============================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signUpBtn").addEventListener("click", () => handleSignIn("signup"));
  document.getElementById("logInBtn").addEventListener("click", () => handleSignIn("login"));
});

// =============================
// Redirect if already logged in
// =============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "index.html"; // already signed in → skip login
  }
});
