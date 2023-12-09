import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, onChildAdded, child, orderByChild, startAt, endAt, get, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
const nos = document.getElementById("nos");

const butt_nos = document.getElementById("butt_nos");


let Id_device;
onAuthStateChanged(auth, (user) => {
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
      avtUser1.src = snapshot.val();
    });
    nameuser1.innerHTML = user.displayName;
    // console.log(user.displayName);

    onValue(ref(database, `${encodedEmail}/Id_Device`), (snapshot) => {
      Id_device = snapshot.val();
      handleIdDeviceUpdate(Id_device);

      
    });
  }
});

let myChart; // Khai báo biến myChart ở ngoài hàm để lưu trữ biểu đồ

butt_nos.addEventListener('click', function() {
  const fre_nosValue = nos.value;
  set(ref(database, `${Id_device}/fre_nos`), fre_nosValue);
  location.reload()
});

function handleIdDeviceUpdate(value) {
  console.log(value);
  // console.log(nos.value);
  
  const fre_nosRef = ref(database, `${value}/fre_nos`);
  let fre_nos;
  onValue(fre_nosRef, (snapshot) => {
    fre_nos = snapshot.val();
    nos.value = fre_nos;
    // location.reload()
  });


  const powerData = [];
  const timeData = [];
  let dayData;
  let hourData;

  const powerRef = ref(database, `${value}/chart_power`);
  onValue(powerRef, (snapshot) => {

    const hour = new Date().getHours();

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      powerData.push(data.power);
      timeData.push(data.time);

      hourData = (data.hour);

      if ((hour - hourData) >= 5) {
        const childRef = ref(database, `${value}/chart_power/${childSnapshot.key}`);
        remove(childRef);
      }
    });

    const displayDataCount = fre_nos;
    if (powerData.length > displayDataCount) {
      powerData.splice(0, powerData.length - displayDataCount);
      timeData.splice(0, timeData.length - displayDataCount);
    }

    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    if (typeof myChart !== 'undefined') {
      myChart.destroy();
    }
    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeData,
        datasets: [{
          label: 'Công suất',
          data: powerData,
          borderColor: 'rgba(75, 192, 192, 1)',
          // borderColor: '#5099c4',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ công suất',
            align: 'center',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'chartArea',
            align: 'start', 
            labels: {
              usePointStyle: true
            }
          }
        },
        scales: {
          x: {
            grid:{
              color: '#DADBDF'
            }
          },
          y: {
            grid:{
              color: '#DADBDF'
            },
            beginAtZero: true
          }
        }
      }
    });
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



