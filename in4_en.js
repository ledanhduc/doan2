import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get, onChildAdded, onChildChanged, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyBsUW2NzEFYcgc32BN0yWdbFKUKxSvgmdI",
//   authDomain: "sendopt-20057.firebaseapp.com",
//   databaseURL: "https://sendopt-20057-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "sendopt-20057",
//   storageBucket: "sendopt-20057.appspot.com",
//   messagingSenderId: "160375474039",
//   appId: "1:160375474039:web:cff60b027beaf046194372"
// };

import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
const id_st = document.getElementById("st_id");
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

    // onValue(ref(database, `${encodedEmail}/history`), (snapshot) => {
    //   const data = snapshot.val();
      // for (const key in data) {
      //   if (Object.prototype.hasOwnProperty.call(data, key)) {
      //     console.log(`Key: ${key}, Value: ${data[key]}`);
      //     // Hiển thị lên giao diện người dùng
      //     // Ví dụ: document.getElementById('result').innerHTML += `Key: ${key}, Value: ${data[key]} <br>`;
      //   }
      // }
    // });
  }
});
  
  function handleIdDeviceUpdate(value) {
  
  console.log(value);
  const tempRef = ref(database, `${value}/Frequency`);
// const tempRef = ref(database, '11971268/Frequency');

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

// const tot_preRef = ref(database, `${value}/Voltage`);

// onValue(tot_preRef, (snapshot) => {
  //   const tot_pre = snapshot.val();
  //   document.getElementById('tot_pre').textContent = tot_pre + " V";
  //   document.getElementById('num_pre').style.setProperty('--tot_pre', tot_pre + " V");
  //   document.getElementById('num_pre').style.setProperty('--dot_pre', `${360 / tot_pre}deg`);
  
  // });
// const stCir_Ref = ref(database, `${value}/lamp_1_state`);
// const st_cir = document.getElementById('st_cir')
// onValue(stCir_Ref, (snapshot) => {
//   const stCir = snapshot.val();
//   if (stCir) {
//     st_cir.style.background = "rgba(57,198,92,255)";
//   } else {
//     st_cir.style.background = "rgb(227, 4, 90)";
//   }
// });

  const preRef = ref(database, `${value}/Voltage`);
  
  onValue(preRef, (snapshot) => {
    const pre = snapshot.val();
    document.getElementById('pre').textContent = pre.toFixed(1) + " V";
    document.getElementById('pre1').textContent = pre.toFixed(1) + " V";
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

  const energyRef = ref(database, `${value}/Energy`);
  var day = new Date().getDate();
  var energy
  var energy_11;

  onValue(energyRef, (snapshot) => {
    energy = snapshot.val();
    document.getElementById('energy').textContent = energy + ' kWh';
    document.getElementById('energy1').textContent = energy ;
    
    document.getElementById("num_energy").style.setProperty('--num_day', day);
  
  
    const energy11Ref = ref(database, `${value}/Energy_11`);
    onValue(energy11Ref, (snapshot) => {
      energy_11 = snapshot.val();
      if(day != 10){
        document.getElementById('eom').textContent = (energy -energy_11).toFixed(3) + ' kWh';
        document.getElementById('eom1').textContent = (energy -energy_11).toFixed(1);
      }
    });
  });

  const energy10Ref = ref(database, `${value}/Energy_10`);  
  var energy_10
  onValue(energy10Ref, (snapshot) => {
    energy_10 = snapshot.val();
    // console.log(energy_10)
    const energy11Ref = ref(database, `${value}/Energy_11`);
    onValue(energy11Ref, (snapshot) => {
      energy_11 = snapshot.val();
      if(day == 10){
        document.getElementById('eom').textContent = (energy_10 -energy_11).toFixed(3) + ' kWh';
        document.getElementById('eom1').textContent = (energy_10 -energy_11).toFixed(1);
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
}

var today = new Date();
var day = today.getDate();
document.getElementById("num_energy").style.setProperty('--num_day', day);
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

var userRead = sessionStorage.getItem('userses') || localStorage.getItem('user');
if (userRead === null) {
    try {
        auth.signOut();
        window.location.replace("login_en.html"); // Chuyển hướng trở lại trang đăng nhập
    } catch(error) {
        console.error(error);
    }
}




