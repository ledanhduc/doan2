import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue, onChildAdded, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
let Id_device;
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
      id_st.innerText ="ID: " + Id_device;
      handleIdDeviceUpdate(Id_device);
    });
  }
});

function handleIdDeviceUpdate(value) {
console.log(value);

const stCir_Ref = ref(database, `${value}/lamp_1_state`);
const st_cir = document.getElementById('st_cir')
onValue(stCir_Ref, (snapshot) => {
  const stCir = snapshot.val();
  if (stCir) {
    st_cir.style.background = "rgba(57,198,92,255)";
  } else {
    st_cir.style.background = "rgb(227, 4, 90)";
  }
});  
  
const tempRef = ref(database, `${value}/Frequency`);
onValue(tempRef, (snapshot) => {
  const temp = snapshot.val().toFixed(1);
  // console.log(temp);
  document.getElementById('temp').textContent = temp + ' Hz';
  document.getElementById('temp1').textContent = temp + ' Hz';
  document.getElementById('num_temp').style.setProperty('--num_temp', temp);
  if(temp == null){
    alert("Device not found");
  }
});

const preRef = ref(database, `${value}/Voltage`);
onValue(preRef, (snapshot) => {
  const pre = snapshot.val().toFixed(1);
  document.getElementById('pre').textContent = pre + " V";
  document.getElementById('pre1').textContent = pre + " V";
  document.getElementById('num_pre').style.setProperty('--num_pre', pre);
});

const humiRef = ref(database, `${value}/Current`);
onValue(humiRef, (snapshot) => {
  const humi = snapshot.val();
  document.getElementById('humi').textContent = humi + ' A';
  document.getElementById('humi1').textContent = humi + ' A';
  document.getElementById('num_humi').style.setProperty('--num_humi', humi);
});

const powerRef = ref(database, `${value}/Power`);
onValue(powerRef, (snapshot) => {
  const power = snapshot.val();
  document.getElementById('power').textContent = power + ' W';
  document.getElementById('power1').textContent = power + ' W';
  // document.getElementById('num_power').style.setProperty('--num_power', power);
  if(power >=1500){
    document.getElementById("num_power").style.setProperty("--clr-power", "red");
  }
  else document.getElementById("num_power").style.setProperty("--clr-power", "#17c943");
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



