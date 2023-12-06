import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


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

const tempRef = ref(database, 'c302/temp');

onValue(tempRef, (snapshot) => {
  const temp = snapshot.val();
  document.getElementById('temp').textContent = temp + '°C';
  document.getElementById('temp1').textContent = temp + '℃';
  document.getElementById('num_temp').style.setProperty('--num_temp', temp);
});

const tot_preRef = ref(database, 'c302/pre_total');

onValue(tot_preRef, (snapshot) => {
  const tot_pre = snapshot.val();
  document.getElementById('tot_pre').textContent = tot_pre;
  document.getElementById('num_pre').style.setProperty('--tot_pre', tot_pre);
  document.getElementById('num_pre').style.setProperty('--dot_pre', `${360 / tot_pre}deg`);

});

const preRef = ref(database, 'c302/pre');

onValue(preRef, (snapshot) => {
  const pre = snapshot.val();
  document.getElementById('pre').textContent = pre;
  document.getElementById('pre1').textContent = pre;
  document.getElementById('num_pre').style.setProperty('--num_pre', pre);
});

const humiRef = ref(database, 'c302/humi');

onValue(humiRef, (snapshot) => {
  const humi = snapshot.val();
  document.getElementById('humi').textContent = humi + '%';
  document.getElementById('humi1').textContent = humi + '%';
  document.getElementById('num_humi').style.setProperty('--num_humi', humi);
});

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
      avtUser1.src = snapshot.val();
    });
    nameuser1.innerHTML = user.displayName;
    console.log(user.displayName);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    
  } else {
    window.location.replace("login_vi.html")
  }
});

var userRead =  sessionStorage.getItem('userses') || localStorage.getItem('user');
if (userRead === null) {
    try {
        auth.signOut();
    }
    catch(error){
        console.error(error);
      };
}
