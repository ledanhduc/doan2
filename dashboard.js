import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
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

    // onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
    //   // Id_device = snapshot.val();
    //   // handleIdDeviceUpdate(Id_device);
    // });
    function deleteDeviceByKey(key) {
      const deviceRef = ref(database, `${encodedEmail}/devices/${key}`);
      remove(deviceRef)
        .then(() => {
          // console.log(`Device with key ${key} deleted successfully.`);
          location.reload();
        })
        .catch((error) => {
          console.error(`Failed to delete device with key ${key}: ${error.message}`);
        });
    }

    onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
      const devices = snapshot.val(); // Lấy dữ liệu từ snapshot
      if(devices == null){
        const aler = document.createElement('h2');
        aler.innerText = "Add more devices - Always by your side";
        document.getElementById('find').appendChild(aler);
        const image = document.createElement('img');
        image.src = 'img/logo_1.png';
        document.getElementById('img1').appendChild(image);
        // console.log("1")
      } else {
        document.getElementById('find').remove();
        document.getElementById('img1').remove();
      }
      // Lặp qua các khóa và giá trị trong devices
      for (const key in devices) {
          const value = devices[key];
  
          // Tạo phần tử HTML tương ứng
          const analyseDiv = document.createElement('div');
          analyseDiv.classList.add('analyse');
  
          const presentDiv = document.createElement('div');
          presentDiv.classList.add('Present');
  
          const statusDiv = document.createElement('div');
          statusDiv.classList.add('status');
  
          const infoDiv = document.createElement('div');
          infoDiv.classList.add('info');
  
          const voltageHeading = document.createElement('h3');
          voltageHeading.id = 'id_device';
          voltageHeading.innerText = "ID Device: " + key;
          
          const nameHeading = document.createElement('h3');
          nameHeading.id = 'id_name';
          nameHeading.innerText = "Name Device: " + value;

          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'Delete';
          deleteButton.dataset.key = key;

          deleteButton.addEventListener('click', function() {
            const keyToDelete = this.dataset.key;
            deleteDeviceByKey(keyToDelete);
          });
  
          infoDiv.appendChild(voltageHeading);
          infoDiv.appendChild(nameHeading);
          infoDiv.appendChild(deleteButton);
          statusDiv.appendChild(infoDiv);
          presentDiv.appendChild(statusDiv);
          analyseDiv.appendChild(presentDiv);
  
          // Thêm phần tử HTML vào vị trí mong muốn trong trang web
          const container = document.getElementById('id'); // Thay 'container' bằng id của phần tử chứa các phần tử analyse
          container.appendChild(analyseDiv);
      }

    });
  }
});

// function handleIdDeviceUpdate(value) {

// }

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




