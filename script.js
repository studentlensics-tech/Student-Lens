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
  const profileBtn   = document.getElementById("Profile-btn");
  const dropdownMenu = document.getElementById("profileDropdown");

  // Toggle dropdown
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdownMenu.classList.toggle("active");
    profileBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close on outside click
  document.addEventListener("click", () => {
    if (dropdownMenu.classList.contains("active")) {
      dropdownMenu.classList.remove("active");
      profileBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Buttons
 document.getElementById("accountBtn").addEventListener("click", () => {
  window.location.href = "https://studentlensics-tech.github.io/Student-Lens/account.html";
});

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    signOut(auth).catch((err) => console.error("Sign out error:", err.message));
    dropdownMenu.classList.remove("active");
    profileBtn.setAttribute("aria-expanded", "false");
  });
});


// =============================
// Update profile on login
// =============================
onAuthStateChanged(auth, (user) => {
  const profileBtn = document.getElementById("profile-name"); // ensure in scope
  if (user) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("main-screen").style.display = "block";

    // Update Google name + pic
    profileBtn.innerHTML = user.displayName || user.email;
    document.getElementById("profile-pic").src = user.photoURL || "img/IcsBuilding.jpg";
  } else {
    document.getElementById("auth-screen").style.display = "flex";
    document.getElementById("main-screen").style.display = "none";
  }
});

// ===== Header: live date + Home behavior =====
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
  // Set date now
  updateTopDate();

  // Refresh at midnight
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  setTimeout(() => {
    updateTopDate();
    setInterval(updateTopDate, 24 * 60 * 60 * 1000);
  }, nextMidnight - now);

  // Home click: keep user on the main view and scroll to top
  const homeLink = document.getElementById("homeLink");
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("main-screen")?.scrollIntoView({ behavior: "smooth" });
      // If you want to truly navigate: window.location.href = "/";
    });
  }
});








