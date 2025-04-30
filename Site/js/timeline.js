const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");
let currentDate = new Date();

// Load the current month
window.onload = () => {
  loadTasks();
  updateMonthLabel();
  buildCalendar(currentDate);
  document.getElementById("prevMonthBtn").addEventListener("click", changeMonth);
  document.getElementById("nextMonthBtn").addEventListener("click", changeMonth);
};

// Build calendar grid for the current month
function buildCalendar(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const calendarGrid = document.getElementById("calendarGrid");

  // Clear previous month
  calendarGrid.innerHTML = "";

  // Get the day of the week for the first day of the month
  const firstDay = firstDayOfMonth.getDay();

  // Create empty spaces for the first week
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    calendarGrid.appendChild(emptyDiv);
  }

  // Add the days of the month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day-item";
    dayDiv.textContent = day;
    dayDiv.addEventListener("click", () => showDayTasks(day));
    calendarGrid.appendChild(dayDiv);
  }
}

// Change the month when the user clicks next/previous buttons
function changeMonth(event) {
  if (event.target.id === "prevMonthBtn") {
    currentDate.setMonth(currentDate.getMonth() - 1);
  } else {
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  buildCalendar(currentDate);
  updateMonthLabel();
  loadTasks();
}

// Update the month label
function updateMonthLabel() {
  const monthLabel = document.getElementById("monthLabel");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  monthLabel.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

// Fetch tasks from the backend
async function loadTasks() {
  const taskRes = await fetch(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const taskData = await taskRes.json();
  const tasks = Array.isArray(taskData) ? taskData : taskData.tasks || [];

  // Empty task list for the current month
  const taskDays = document.querySelectorAll(".calendar-day-item");
  taskDays.forEach(day => day.innerHTML = day.textContent); // Clear previous tasks

  tasks.forEach(task => {
    const taskDate = new Date(task.dueDate);
    if (taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear()) {
      const taskDay = taskDate.getDate() - 1;  // Adjust index for array (0-based)
      const taskElement = document.createElement("div");
      taskElement.className = "task";
      taskElement.textContent = task.title;
      taskElement.addEventListener("mouseenter", () => showTaskDetails(task));
      taskDays[taskDay].appendChild(taskElement);
    }
  });
}

// Display task details on hover
function showTaskDetails(task) {
  const taskDetail = document.createElement("div");
  taskDetail.className = "task-details-popup";
  taskDetail.innerHTML = `
    <strong>Project:</strong> ${task.projectName}<br>
    <strong>Description:</strong> ${task.description}<br>
    <strong>Start Date:</strong> ${task.startDate}<br>
    <strong>End Date:</strong> ${task.endDate}
  `;
  document.body.appendChild(taskDetail);

  // Remove popup after a short delay
  setTimeout(() => {
    document.body.removeChild(taskDetail);
  }, 3000);
}

// Show tasks for a specific day when clicked
function showDayTasks(day) {
  alert(`Showing tasks for ${day}`);
}
