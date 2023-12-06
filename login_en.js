import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBsUW2NzEFYcgc32BN0yWdbFKUKxSvgmdI",
    authDomain: "sendopt-20057.firebaseapp.com",
    databaseURL: "https://sendopt-20057-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sendopt-20057",
    storageBucket: "sendopt-20057.appspot.com",
    messagingSenderId: "160375474039",
    appId: "1:160375474039:web:cff60b027beaf046194372"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const registerForm = document.querySelector('.register form');
const loginForm = document.querySelector('.login form');
const checkbox = document.getElementById('rmb_ac');
const iddeviceInput = document.getElementById("iddevice");
const emailRegInput = document.getElementById("email_reg");
const passRegInput = document.getElementById("pass_reg");
const emailSigInput = document.getElementById("email_sig");
const passSigInput = document.getElementById("pass_sig");

const checkLoggedIn = async () => {
    const user = await new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });

    return !!user;
};

const signup = async (e) => {
    e.preventDefault();
    const iddevice = iddeviceInput.value;
    const email_reg = emailRegInput.value;
    const pass_reg = passRegInput.value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email_reg, pass_reg);

        alert("Sign up successful");
        const encodedEmail = encodeURIComponent(email_reg.replace(/[.@]/g, '_'));
        await set(ref(db, `${encodedEmail}`), iddevice);
        console.log("Lưu thông tin đăng ký vào Firebase thành công");

        if (await checkLoggedIn()) {
            window.location.replace("login_en.html");
        }
    } catch (error) {
        alert("Sign up failed: " + error.message);
    }
};

let ipAddress;

const getIPAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org/?format=json");
    const data = await response.json();
    ipAddress = data.ip;
  } catch (error) {
    console.error("Failed to get IP address:", error);
  }
};

const login = async (e) => {
    e.preventDefault();
    const emailSig = emailSigInput.value;
    const passSig = passSigInput.value;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailSig, passSig);
      const encodedEmail = encodeURIComponent(emailSig.replace(/[.@]/g, '_'));
      const user = userCredential.user;
      const timestamp = new Date().toLocaleString().replace(/[/]/g, '_');
      await set(ref(db, `${encodedEmail}/history/${timestamp}`), ipAddress);

      sessionStorage.setItem('userses', JSON.stringify(user));
  
      if (checkbox.checked) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.clear();
      }
  
      window.location.replace("analytics_en.html");
    } catch (error) {
      alert("Sign in failed: " + error.message);
    }
};

getIPAddress();

// const redirectUser = (page) => {
//     window.location.replace(page);
// };

// checkLoggedIn().then((isLoggedIn) => {
//     if (isLoggedIn) {
//         redirectUser("analytics_en.html");
//     }
// });

const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    try {
        auth.signInWithEmailAndPassword(user.email, user.password);
    } catch (error) {
        console.error(error);
    }
} else {
    try {
        auth.signOut();
    } catch (error) {
        console.error(error);
    }
}

registerForm.addEventListener('submit', signup);
loginForm.addEventListener('submit', login);
