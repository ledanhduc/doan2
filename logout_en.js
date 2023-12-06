
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const auth = getAuth();

const logoutBtn = document.querySelector(".logout");

logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.replace("login_en.html");
  });
});


