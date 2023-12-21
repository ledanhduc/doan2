import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref as databaseRef, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";



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
const database = getDatabase(app);
const auth = getAuth(app);
const user = auth.currentUser;

let encodedEmail;

const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");

const add = document.getElementById("add");
const id_devices = document.getElementById("id_devices");
const id_name = document.getElementById("id_name");
const selectElement = document.getElementById('pet-select');

add.addEventListener('click', function() {
  if (id_devices.value === '') {
    alert("Please enter a device ID");
    return;
  }
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
      // set(ref(database, `${encodedEmail}/nameuser`), nameuser.value);
      set(databaseRef(database, `${encodedEmail}/devices/${id_devices.value}`), id_name.value);
      set(databaseRef(database, `${id_devices.value}/type`), selectElement.value);
      alert("Add Devices successfully")
      window.close();
    } else {
      // Người dùng chưa đăng nhập
      console.log("Không có người dùng nào đang đăng nhập.");
    }
  });
});

onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));   
    onValue(databaseRef(database, `${encodedEmail}/avt_img`), (snapshot) => {
      avtUser1.src = snapshot.val();
    });
    nameuser1.innerHTML = user.displayName;
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
  } else {
    window.location.replace("login_en.html")
  }
});

// var userRead =  sessionStorage.getItem('userses') || localStorage.getItem('user');
// if (userRead === null) {
//     try {
//         auth.signOut();
//     }
//     catch(error){
//         console.error(error);
//       };
// }
