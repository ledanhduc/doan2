import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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
// const db = getDatabase(app);
const auth = getAuth(app);

const butt_fgp = document.getElementById("fgp");
const email_fgp = document.getElementById("email_fgp");
butt_fgp.addEventListener('click', function() {
    console.log(email_fgp)
    sendPasswordResetEmail(auth, email_fgp.value)
    .then(() => {
        alert('Pls check your email !');
    })
    .catch((error) => {
        const errorCode = error.code;
        // alert(errorCode)
        const errorMessage = error.message;
        alert(errorMessage)
    });
});
