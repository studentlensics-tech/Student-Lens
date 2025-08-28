// =============================
/// Firebase (shared config)
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

// =============================
// Page boot
// =============================
document.addEventListener("DOMContentLoaded", () => {
  // 1) Wait for Firebase to resolve state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Already signed in → straight to app
      location.replace("index.html");
      return;
    }

    // 2) Not signed in → wire up buttons
    const signUpBtn = document.getElementById("signUpBtn");
    const logInBtn  = document.getElementById("logInBtn");

    function handleSignIn(mode) {
      signInWithPopup(auth, provider)
        .then((result) => {
          const u = result.user;
          const domain = (u.email || "").split("@")[1];
          if (domain !== "icsz.ch") {
            alert("You must use your school email.");
            return signOut(auth);
          }
          // Success → jump to app
          location.replace("index.html");
        })
        .catch((err) => console.error(`${mode} error:`, err));
    }

    signUpBtn?.addEventListener("click", () => handleSignIn("signup"));
    logInBtn?.addEventListener("click", () => handleSignIn("login"));
  });
});
