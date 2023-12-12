import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get, onChildAdded, onChildChanged, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
// const id_st = document.getElementById("st_id");
let Id_device;
var energy11;
var energy10;
var tier_1;
var tier_2;
var tier_3;
var tier_4;
var tier_5;
var tier_6;

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
      const energy11Ref = ref(database, `${Id_device}/Energy_11`);
      onValue(energy11Ref, (snapshot) => {
        energy11 = snapshot.val();
        handleIdDeviceUpdate(Id_device,energy11,energy10);
      });

      const energy10rRef = ref(database, `${Id_device}/Energy_10`);
      onValue(energy10rRef, (snapshot) => {
        energy10 = snapshot.val();
        handleIdDeviceUpdate(Id_device,energy11,energy10);
      });
    });

  }
});

function handleIdDeviceUpdate(value,energy11,energy10) {
  // console.log(value);
  
  if (typeof energy10 !== 'undefined' && typeof energy11 !== 'undefined') {
    var total = energy10 - energy11;

      // console.log(total)
      document.getElementById('total').value = total;
      if(total <= 50){
        set(ref(database, `${value}/tier_1`), total);
        set(ref(database, `${value}/tier_2`), 0);
        set(ref(database, `${value}/tier_3`), 0);
        set(ref(database, `${value}/tier_4`), 0);
        set(ref(database, `${value}/tier_5`), 0);
        set(ref(database, `${value}/tier_6`), 0);
      }else if(total>50){
        set(ref(database, `${value}/tier_1`), 50);
      }
      if(total<=100 && (total-50) >0){
        set(ref(database, `${value}/tier_2`), total-50);
        set(ref(database, `${value}/tier_3`), 0);
        set(ref(database, `${value}/tier_4`), 0);
        set(ref(database, `${value}/tier_5`), 0);
        set(ref(database, `${value}/tier_6`), 0);
      }else if(total>100 ){
        set(ref(database, `${value}/tier_2`), 50);
      }
      if(total<=200 && (total-100) >0){
        set(ref(database, `${value}/tier_3`), total-100);
        set(ref(database, `${value}/tier_4`), 0);
        set(ref(database, `${value}/tier_5`), 0);
        set(ref(database, `${value}/tier_6`), 0);
      }else if(total>200){
        set(ref(database, `${value}/tier_3`), 100);
      }
      if(total<=300 && (total-200) >0){
        set(ref(database, `${value}/tier_4`), total-200);
        set(ref(database, `${value}/tier_5`), 0);
        set(ref(database, `${value}/tier_6`), 0);
      }else if(total>300){
        set(ref(database, `${value}/tier_4`), 100);
      }
      if(total<=400 && (total-300) >0 ){
        set(ref(database, `${value}/tier_5`), total-300);
        set(ref(database, `${value}/tier_6`), 0);
      }else if(total>400){
        set(ref(database, `${value}/tier_5`), 100);
        set(ref(database, `${value}/tier_6`), total-400);
      }

    const tier_1Ref = ref(database, `${Id_device}/tier_1`);
    onValue(tier_1Ref, (snapshot) => {
      tier_1 = snapshot.val();
    });

    const tier_2Ref = ref(database, `${Id_device}/tier_2`);
    onValue(tier_2Ref, (snapshot) => {
      tier_2 = snapshot.val();
    });

    const tier_3Ref = ref(database, `${Id_device}/tier_3`);
    onValue(tier_3Ref, (snapshot) => {
      tier_3 = snapshot.val();
    });

    const tier_4Ref = ref(database, `${Id_device}/tier_4`);
    onValue(tier_4Ref, (snapshot) => {
      tier_4 = snapshot.val();
    });

    const tier_5Ref = ref(database, `${Id_device}/tier_5`);
    onValue(tier_5Ref, (snapshot) => {
      tier_5 = snapshot.val();
    });
    
    const tier_6Ref = ref(database, `${Id_device}/tier_6`);
    onValue(tier_6Ref, (snapshot) => {
      tier_6 = snapshot.val();
    });
    
    function format_m(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    var tol_money_n_v
    var tol_money_v
    var tol_money
    const cal_money = document.getElementById('cal_total')
    cal_money.addEventListener('click', function() {
      tol_money_n_v = tier_1*1806 + tier_2*1866 + tier_3*2167	+ tier_4*2729	+ tier_5*3050 + tier_6*3151;
      // console.log(tol_money_n_v);
      document.getElementById('total_n_v').value = format_m(tol_money_n_v);
      tol_money_v = tol_money_n_v*8/100;
      // console.log(tol_money_v)
      document.getElementById('total_v').value = format_m(tol_money_v);
      tol_money = tol_money_n_v + tol_money_v;
      document.getElementById('total_m').value = format_m(tol_money);
    });

    const Orders1 = [
      {
          // number:'1',
          productNumber: '50',
          paymentStatus: '1 806',
          current: tier_1,
      
      },
      {
          // number:'1',
          productNumber: '50',
          paymentStatus: '1 866',
          current: tier_2,
      },
      {
          // number:'',
          productNumber: '100',
          paymentStatus: '2 167',
          current: tier_3,
      },    
      {
          // number:'',
          productNumber: '100',
          paymentStatus: '2 729',
          current: tier_4,
      },    
      {
          // number:'',
          productNumber: '100',
          paymentStatus: '3 050',
          current: tier_5,
      },
      {
          // number:'',
          productNumber: '0',
          paymentStatus: '3 151',
          current: tier_6,
      },
    ]
    
    let a = 1;
    Orders1.forEach(order => {
        const tr = document.createElement('tr');
        const trContent = `
            <td>${a}</td>
            <td>${order.productNumber}</td>
            <td>${order.paymentStatus}</td>
            <td>${order.current}</td>
        `;
        a++;
        tr.innerHTML = trContent;
        document.querySelector('table tbody').appendChild(tr);
    });
  }
}


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

// const Orders1 = [
//   {
//       // number:'1',
//       productNumber: '50',
//       paymentStatus: '1806',
//       current: '50',
  
//   },
//   {
//       // number:'1',
//       productNumber: '50',
//       paymentStatus: '1866',
//       current: '50',
//   },
//   {
//       // number:'',
//       productNumber: '100',
//       paymentStatus: '2167',
//       current: '200',
//   },    
//   {
//       // number:'',
//       productNumber: '100',
//       paymentStatus: '2729',
//       current: '',
//   },    
//   {
//       // number:'',
//       productNumber: '100',
//       paymentStatus: '3050',
//       current: '',
//   },
//   {
//       // number:'',
//       productNumber: '0',
//       paymentStatus: '3151',
//       current: '',
//   },
// ]

// let a = 1;
// Orders1.forEach(order => {
//     const tr = document.createElement('tr');
//     const trContent = `
//         <td>${order.current}</td>
//         <td>${a}</td>
//         <td>${order.productNumber}</td>
//         <td>${order.paymentStatus}</td>
//     `;
//     a++;
//     tr.innerHTML = trContent;
//     document.querySelector('table tbody').appendChild(tr);
// });



