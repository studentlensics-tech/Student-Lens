// =============================
// Firebase Setup
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase config from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAsGS-W7EZ_ZX7Cgv_ZxwOLZkp-u8ilaRQ",
  authDomain: "studentlensics-4369f.firebaseapp.com",
  projectId: "studentlensics-4369f",
  storageBucket: "studentlensics-4369f.firebasestorage.app",
  messagingSenderId: "792919091240",
  appId: "1:792919091240:web:31ae2869ddd8b0d28cad1d",
  measurementId: "G-V3YBM8DZXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// =============================
// Old client_id removed — Firebase handles this
// =============================

// Local storage-based "account" tracking (still works as before)
function handleLoginResult(user, mode) {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const isExisting = existingUsers.some(u => u.email === user.email);

    if (mode === "signup") {
        if (isExisting) {
            document.getElementById("auth-message").textContent = "Account already exists. Please log in.";
        } else {
            existingUsers.push({ email: user.email, name: user.displayName });
            localStorage.setItem("users", JSON.stringify(existingUsers));
            document.getElementById("auth-message").textContent = `Welcome, ${user.displayName}! Account created.`;
            showMainScreen();
        }
    } else if (mode === "login") {
        if (isExisting) {
            document.getElementById("auth-message").textContent = `Welcome back, ${user.displayName}!`;
            showMainScreen();
        } else {
            document.getElementById("auth-message").textContent = "No account found. Please sign up first.";
        }
    }
}

// =============================
// Show/hide screens
// =============================
function showMainScreen() {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";
}

// =============================
// Button handlers
// =============================
window.onload = function () {
    document.getElementById("signUpBtn").addEventListener("click", () => {
        window.authMode = "signup";
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

                // ✅ Restrict to @icsz.ch
                const domain = user.email.split("@")[1];
                if (domain !== "icsz.ch") {
                    alert("You must use your school email to sign up.");
                    signOut(auth);
                    return;
                }

                handleLoginResult(user, "signup");
            })
            .catch((error) => {
                console.error("Signup error:", error.message);
            });
    });

    document.getElementById("logInBtn").addEventListener("click", () => {
        window.authMode = "login";
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

                // ✅ Restrict to @icsz.ch
                const domain = user.email.split("@")[1];
                if (domain !== "icsz.ch") {
                    alert("You must use your school email to log in.");
                    signOut(auth);
                    return;
                }

                handleLoginResult(user, "login");
            })
            .catch((error) => {
                console.error("Login error:", error.message);
            });
    });
};

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Watch for user state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in → stay on main screen
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";

    // Optional: update profile info
    document.getElementById("profile-name").innerHTML = user.displayName || user.email;
    document.getElementById("profile-pic").src = user.photoURL || "img/IcsBuilding.jpg";
  } else {
    // No user → show login screen
    document.getElementById("auth-screen").style.display = "flex";
    document.getElementById("main-screen").style.display = "none";
  }
});


