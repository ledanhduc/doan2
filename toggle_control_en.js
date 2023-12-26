import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
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
const auth = getAuth();

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
let Id_device ;
// const id_device_1 = document.getElementById("id_device");
onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
      avtUser1.src = snapshot.val();
    });
    nameuser1.innerHTML = user.displayName;
    console.log(user.displayName);

    onValue(ref(database, `${encodedEmail}/Id_Device`), (snapshot) => {
      Id_device = snapshot.val();
      document.getElementById("id_device").textContent = Id_device;
      // console.log(Id_device);
      handleIdDeviceUpdate(Id_device);
    });
  }
});
function toggleLamp(toggleElem, stateElem, path) {
  let parentNode = toggleElem.parentNode;
  parentNode.classList.toggle('active');
  if (parentNode.classList.contains('active')) {
    set(ref(database, path), true);
  } else {
    set(ref(database, path), false); 
  }
}

function handleIdDeviceUpdate(value) {
  
let lamps = [
{toggle: document.getElementById('lamp_1_toggle'), state: document.getElementById('lamp_1_state'), path: `${value}/lamp_1_state`},
];

lamps.forEach(function(lamp) {
lamp.toggle.addEventListener('click', function() {
  toggleLamp(lamp.toggle, lamp.state, lamp.path);
});
});


let lamps_fb = [
  {toggle: document.getElementById('lamp_1_toggle'), state: document.getElementById('lamp_1_state'), path: `${value}/lamp_1_state`},
];

lamps_fb.forEach(function(lamp_fb) {
  onValue(ref(database, lamp_fb.path), function(snapshot) {
    let state = snapshot.val();
    if (state) {
      lamp_fb.toggle.parentNode.classList.add('active');
      lamp_fb.state.innerHTML = "ON";
      lamp_fb.state.style.color = "rgba(57,198,92,255)";
    } else {
      lamp_fb.toggle.parentNode.classList.remove('active');
      lamp_fb.state.innerHTML = "OFF";
      lamp_fb.state.style.color = "rgb(227, 4, 90)";
      set(ref(database, `${value}/st_timer`), false); 
    }
  });
});

var currentMinute;
var currentSeconds;
const st_cir = document.getElementById('st_cir');
let onlesp;
let lastOnlineTime = 0; 
var ms;
function sendCurrentMinute() {
  currentMinute = new Date().getMinutes(); 
  currentSeconds = new Date().getSeconds(); 
  ms = currentMinute * 60 + currentSeconds; 
  const onlesp_stRef = ref(database, `${value}/onlesp_st`);
  onValue(onlesp_stRef, (snapshot) => {
    onlesp = snapshot.val();
  });

  if (onlesp === currentMinute) {
    lastOnlineTime = ms;
    st_cir.style.background = "rgba(57, 198, 92, 255)";
  } else if (lastOnlineTime < (ms - 10)) {
    st_cir.style.background = "rgb(227, 4, 90)";
  }
  }
setInterval(sendCurrentMinute, 1 * 1000);

const butt_timer = document.getElementById('butt_timer');
butt_timer.addEventListener('click', function() {
  const timeInput = document.getElementById("timeInput");
  const selectedTime = timeInput.value;

  const [hour, minute] = selectedTime.split(":");
  set(ref(database, `${value}/h_timer`), parseInt(hour, 10)); 
  set(ref(database, `${value}/m_timer`), parseInt(minute, 10)); 
  set(ref(database, `${value}/st_timer`), true); 
});

onValue(ref(database, `${value}/st_timer`), (snapshot) => {
  const st_timer = snapshot.val();
  if(st_timer == true){
    document.getElementById('st_timer').style.color = "rgb(29 154 60)";
    document.getElementById('st_timer').style.fontWeight = "800";
    document.getElementById('st_timer').innerText = "TIMER ON";
  } else{
    // document.getElementById('butt_timer').style.color = "rgb(227, 4, 90)";
  }
});
  
const butt_current = document.getElementById('butt_current')
butt_current.addEventListener('click', function() {
  const currentInput = document.getElementById("currentInput");
  // const selectedTime = currentInput.value;
  if(currentInput.value > 9.5)
  {
    alert("Current set max = 9.5A")
  }
  else console.log(currentInput.value);
});
const butt_energy = document.getElementById('butt_energy')
butt_energy.addEventListener('click', function() {
  const energyInput = document.getElementById("energyInput");
  console.log(energyInput.value);
});

}


onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    
  } else {
    window.location.replace("login_en.html")
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
