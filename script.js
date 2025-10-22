const staffList = [
  "SH9861",
  "SH10070",
  "SH14326",
  "SH16611",
  "SH18556",
  "SH19800",
  "SH20201",
];

const form = document.getElementById("trackerForm");
const message = document.getElementById("message");
const summaryTable = document.querySelector("#summaryTable tbody");
const grandTotalCell = document.getElementById("grandTotal");
const exportBtn = document.getElementById("exportBtn");
const monthLabel = document.getElementById("monthLabel");

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function loadData() {
  let stored = localStorage.getItem("tiktokTracker");
  if (!stored) {
    stored = { month: getCurrentMonth(), records: {} };
    localStorage.setItem("tiktokTracker", JSON.stringify(stored));
  } else {
    stored = JSON.parse(stored);
    // auto-reset on new month
    if (stored.month !== getCurrentMonth()) {
      stored = { month: getCurrentMonth(), records: {} };
      localStorage.setItem("tiktokTracker", JSON.stringify(stored));
    }
  }
  return stored;
}

function saveData(data) {
  localStorage.setItem("tiktokTracker", JSON.stringify(data));
}

function updateSummary() {
  const data = loadData();
  summaryTable.innerHTML = "";
  let grandTotal = 0;
  staffList.forEach((staff) => {
    const count = data.records[staff]?.length || 0;
    const row = document.createElement("tr");
    row.innerHTML = `<td>${staff}</td><td>${count}</td>`;
    summaryTable.appendChild(row);
    grandTotal += count;
  });
  grandTotalCell.textContent = grandTotal;
  monthLabel.textContent = data.month;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const staffCode = document.getElementById("staffCode").value;
  if (!staffCode) return alert("Please select a staff code!");

  const inputs = document.querySelectorAll("#linkInputs input");
  let newLinks = [];
  inputs.forEach((input) => {
    if (input.value.trim() !== "") newLinks.push(input.value.trim());
  });

  if (newLinks.length === 0) return alert("Please enter at least one video link.");

  const data = loadData();

  // check duplicates
  const allLinks = Object.values(data.records).flat();
  for (const link of newLinks) {
    if (allLinks.includes(link)) {
      alert("Duplicate link found: " + link);
      return;
    }
  }

  if (!data.records[staffCode]) data.records[staffCode] = [];
  data.records[staffCode].push(...newLinks);
  saveData(data);

  message.textContent = "✅ Added " + newLinks.length + " video(s).";
  form.reset();
  updateSummary();
  setTimeout(() => (message.textContent = ""), 3000);
});

exportBtn.addEventListener("click", () => {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `tiktok-tracking-${data.month}.json`;
  a.click();
});

window.onload = updateSummary;
