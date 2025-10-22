// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase config (from your console)
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
const videoList = document.getElementById("videoList");

// Submit handler
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const staff = staffCode.value.trim();
  const link = videoLink.value.trim();

  if (staff === "") {
    alert("Please select your staff code first!");
    return;
  }

  if (link === "") {
    alert("Please paste your TikTok link!");
    return;
  }

  const videoRef = ref(db, "videos");
  push(videoRef, {
    staff: staff,
    link: link,
    timestamp: new Date().toLocaleString()
  });

  form.reset();
});

// Real-time display of all videos
const videoRef = ref(db, "videos");
onValue(videoRef, (snapshot) => {
  const data = snapshot.val();
  videoList.innerHTML = "";

  if (data) {
    Object.values(data).forEach((item) => {
      const row = `
        <tr>
          <td><a href="staff.html?staff=${item.staff}">${item.staff}</a></td>
          <td><a href="${item.link}" target="_blank">View Video</a></td>
          <td>${item.timestamp}</td>
        </tr>`;
      videoList.innerHTML += row;
    });
  }
});
