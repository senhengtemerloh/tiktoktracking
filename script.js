// Firebase SDK v9+ modular import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Your Firebase configuration
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

// Form submit event
const form = document.getElementById('videoForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('staffName').value.trim();
  const link = document.getElementById('videoLink').value.trim();

  if (name === '' || link === '') {
    alert('Please fill in both fields');
    return;
  }

  // Push to Firebase
  const videoRef = ref(db, 'videos');
  push(videoRef, {
    staff: name,
    link: link,
    timestamp: new Date().toLocaleString()
  });

  form.reset();
});

// Listen for data changes
const videoList = document.getElementById('videoList');
const videoRef = ref(db, 'videos');

onValue(videoRef, (snapshot) => {
  const data = snapshot.val();
  videoList.innerHTML = '';

  if (data) {
    Object.values(data).forEach((video) => {
      const row = `
        <tr>
          <td>${video.staff}</td>
          <td><a href="${video.link}" target="_blank">View Video</a></td>
          <td>${video.timestamp}</td>
        </tr>`;
      videoList.innerHTML += row;
    });
  }
});
