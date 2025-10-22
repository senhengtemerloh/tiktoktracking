// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1DYwIe7jeaU1BZtLOG69iH4dSHBIOlsA",
  authDomain: "gs009-tracker.firebaseapp.com",
  databaseURL: "https://gs009-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gs009-tracker",
  storageBucket: "gs009-tracker.firebasestorage.app",
  messagingSenderId: "553658720203",
  appId: "1:553658720203:web:2aeff044514977ad60a04e",
  measurementId: "G-XC0DB8GPRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const form = document.getElementById("videoForm");
const staffCode = document.getElementById("staffCode");
const videoLink = document.getElementById("videoLink");
const summaryList = document.getElementById("summaryList");

// Submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const staff = staffCode.value.trim();
  const link = videoLink.value.trim();

  if (!staff) {
    alert("Please select your staff code first!");
    return;
  }

  if (!link) {
    alert("Please paste your TikTok link!");
    return;
  }

  const videoRef = ref(db, "videos");

  // Check duplicates before pushing
  let isDuplicate = false;

  await new Promise((resolve) => {
    onValue(videoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.values(data).forEach((item) => {
          if (item.staff === staff && item.link === link) {
            isDuplicate = true;
          }
        });
      }
      resolve();
    }, { onlyOnce: true });
  });

  if (isDuplicate) {
    alert("You already submitted this video link!");
    return;
  }

  push(videoRef, {
    staff: staff,
    link: link,
    timestamp: new Date().toLocaleString()
  });

  form.reset();
});

// Real-time summary view
const videoRef = ref(db, "videos");
onValue(videoRef, (snapshot) => {
  const data = snapshot.val();
  summaryList.innerHTML = "";

  if (data) {
    const countByStaff = {};

    Object.values(data).forEach((item) => {
      if (!countByStaff[item.staff]) {
        countByStaff[item.staff] = new Set();
      }
      countByStaff[item.staff].add(item.link); // unique links only
    });

    Object.keys(countByStaff).forEach((staff) => {
      const total = countByStaff[staff].size;
      const row = `
        <tr>
          <td>${staff}</td>
          <td>${total}</td>
          <td><a href="staff.html?staff=${staff}">View</a></td>
        </tr>`;
      summaryList.innerHTML += row;
    });
  }
});
