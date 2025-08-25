// =============================
// Firebase Setup
// =============================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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

// ✅ Initialize app safely (won’t throw if called twice)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// =============================
// Local storage-based "account" tracking
// =============================
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
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

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
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

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

// =============================
// Persist login state on reload
// =============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";
    document.getElementById("profile-name").innerHTML = user.displayName || user.email;
    document.getElementById("profile-pic").src = user.photoURL || "img/IcsBuilding.jpg";
  } else {
    document.getElementById("auth-screen").style.display = "flex";
    document.getElementById("main-screen").style.display = "none";
  }
});


// =============================
// Profile Dropdown + Auth UI
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.querySelector(".profile-btn");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  // ✅ Toggle dropdown when profile button clicked
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      dropdownMenu.classList.toggle("active");
    });

    // ✅ Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!profileBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove("active");
      }
    });
  }

  // ✅ Account button (placeholder)
  document.getElementById("accountBtn")?.addEventListener("click", () => {
    alert("Go to account page...");
    // Later: window.location.href = "/account.html";
  });

  // ✅ Logout button (real Firebase logout)
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    signOut(auth).then(() => {
      console.log("User signed out.");
      document.getElementById("auth-screen").style.display = "flex";
      document.getElementById("main-screen").style.display = "none";
    }).catch((error) => {
      console.error("Sign out error:", error.message);
    });
  });
});

// =============================
// Update profile on login
// =============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";

    // ✅ Update Google name + pic
    document.getElementById("profile-name").innerHTML = user.displayName || user.email;
    document.getElementById("profile-pic").src = user.photoURL || "img/IcsBuilding.jpg";
  } else {
    document.getElementById("auth-screen").style.display = "flex";
    document.getElementById("main-screen").style.display = "none";
  }
});


