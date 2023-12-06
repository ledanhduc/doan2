import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
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

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");

const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})


const tableBody = document.querySelector('table tbody');
let number = 1;

onAuthStateChanged(auth, (user) => {  
    if (user) {
      encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
      onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
        avtUser1.src = snapshot.val();
      });
      nameuser1.innerHTML = user.displayName;
    //   console.log(user.displayName);
    }
    onValue(ref(database, `${encodedEmail}/history`), (snapshot) => {
        const data = snapshot.val();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const TIME = key;
                const IP = data[key];
        
                // Kiểm tra xem hàng đã tồn tại trong bảng chưa
                const existingRow = tableBody.querySelector(`tr[data-key="${key}"]`);
        
                if (existingRow) {
                // Nếu hàng đã tồn tại, cập nhật nội dung cột IP
                existingRow.querySelector('.ip-column').textContent = IP;
                } else {

                const tr = document.createElement('tr');
                tr.setAttribute('data-key', key);
                const trContent = `
                    <td>${number}</td>
                    <td>${TIME}</td>
                    <td class="ip-column">${IP}</td>
                    <td>Details</td>
                `;
                tr.innerHTML = trContent;
        
                // Thêm hàng vào tbody của bảng
                tableBody.appendChild(tr);
        
                number++;
                }
            }
        }
    });
});

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
  