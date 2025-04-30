const API_BASE = "http://localhost:8080"; // Update this with your API base URL
const token = localStorage.getItem("access_token");
let currentDate = new Date(2025, 3, 1); // Start with April 2025

// Load the current month and update the grid
window.onload = () => {
  buildCalendar(currentDate); // Ensure calendar is built on load
  loadTasks();
  updateMonthLabel();
  document.getElementById("prevMonthBtn").addEventListener("click", changeMonth);
  document.getElementById("nextMonthBtn").addEventListener("click", changeMonth);
};

// Change the month when the user clicks next/previous buttons
function changeMonth(event) {
  if (event.target.id === "prevMonthBtn") {
    currentDate.setMonth(currentDate.getMonth() - 1); // Go to the previous month
  } else if (event.target.id === "nextMonthBtn") {
    currentDate.setMonth(currentDate.getMonth() + 1); // Go to the next month
  }

  // Ensure that the month stays within 2025
  if (currentDate.getFullYear() === 2025) {
    buildCalendar(currentDate); // Rebuild the calendar
    updateMonthLabel(); // Update the month label
    loadTasks(); // Load tasks for the new month
  } else {
    currentDate.setMonth(currentDate.getMonth() - (event.target.id === "nextMonthBtn" ? 1 : -1)); // Revert if out of bounds
  }
}

// Update the month label
function updateMonthLabel() {
  const monthLabel = document.getElementById("monthLabel");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  monthLabel.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}





// Build the calendar grid (with correct days)
function buildCalendar(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const calendarGrid = document.getElementById("calendarGrid");

  // Clear the calendar grid
  calendarGrid.innerHTML = "";

  // Calculate the first day of the month (for positioning)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Add empty cells for the days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyDiv = document.createElement("div");
    calendarGrid.appendChild(emptyDiv);
  }

  // Add day cells for the days of the month (1 to 31)
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day-item";
    const dateNumber = document.createElement("div");
    dateNumber.className = "date-number";
    dateNumber.textContent = day;
    dayDiv.appendChild(dateNumber);
    calendarGrid.appendChild(dayDiv);
  }
}

// Fetch tasks from the backend and display them on the calendar
async function loadTasks() {
  const taskRes = await fetch(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const taskData = await taskRes.json();
  const tasks = Array.isArray(taskData) ? taskData : taskData.tasks || [];

  // Empty task list for the current month
  for (let i = 1; i <= 31; i++) {
    const taskDay = document.getElementById(`day${i}`);
    if (taskDay) {
      taskDay.innerHTML = `<div class="date-number">${i}</div>`; // Default display of the date
    }
  }

  tasks.forEach(task => {
    const taskDate = new Date(task.dueDate);
    if (taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear()) {
      const taskDay = taskDate.getDate(); // Get the day of the month (1-31)
      const taskElement = document.createElement("div");
      taskElement.className = "task";
      taskElement.textContent = task.title;
      taskElement.addEventListener("mouseenter", () => showTaskDetails(task));

      const taskDayCell = document.getElementById(`day${taskDay}`);
      if (taskDayCell) {
        taskDayCell.appendChild(taskElement); // Add task to the respective day cell
      }
    }
  });
}

// Display task details on hover
function showTaskDetails(task) {
  const taskDetail = document.getElementById("taskDetailsPopup");
  
  // Populate the task details dynamically
  taskDetail.innerHTML = `
    <strong>Task Name:</strong> ${task.title}<br>
    <strong>Description:</strong> ${task.description}<br>
    <strong>Start Date:</strong> ${task.startDate ? task.startDate : 'Not specified'}<br>
    <strong>End Date:</strong> ${task.endDate ? task.endDate : 'Not specified'}
  `;
  
  // Show the popup
  taskDetail.style.display = 'block';

  // Position the popup near the task element (adjust as needed)
  const taskElement = event.target; // This refers to the task element being hovered
  const rect = taskElement.getBoundingClientRect();
  taskDetail.style.left = rect.left + 'px';
  taskDetail.style.top = rect.bottom + 10 + 'px'; // Positioning slightly below the task

  // Hide the popup after 3 seconds (or customize as needed)
  setTimeout(() => {
    taskDetail.style.display = 'none';
  }, 3000);
  console.log("JavaScript is running!");  // Add this line to see if JS is loading

}
