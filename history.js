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


let number = 1;

let Orders = [
    {
        number: '',
        TIME: '',
        IP: ''
    },
];

onAuthStateChanged(auth, (user) => {  
    if (user) {
        encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
        onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
            avtUser1.src = snapshot.val();
        });
        nameuser1.innerHTML = user.displayName;
        // console.log(user.displayName);
    }

    onValue(ref(database, `${encodedEmail}/history`), (snapshot) => {
        const data = snapshot.val();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const TIME = key;
                const IP = data[key];
                number++;

                const order = {
                    number: number,
                    TIME: TIME,
                    IP: IP,
                };

                Orders.push(order);
            }
        }

        displayOrders();
    });
});

function displayOrders() {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';

    Orders.forEach(order => {
        const tr = document.createElement('tr');
        const trContent = `
            <td>${order.number}</td>
            <td>${order.TIME}</td>
            <td>${order.IP}</td>
            <td class="${order.status === 'Online' ? 'danger' : order.status === 'Logout' ? 'warning' : 'primary'}">${order.status}</td>
            <td class="primary">Details</td>
        `;
        tr.innerHTML = trContent;
        tableBody.appendChild(tr);
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

