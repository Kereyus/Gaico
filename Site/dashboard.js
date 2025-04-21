const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

// Load dashboard on page load
window.onload = loadDashboard;

async function loadDashboard() {
  const taskTable = document.getElementById("taskTable");
  const barCanvas = document.getElementById("barChart");
  const pieCanvas = document.getElementById("pieChart");

  const barCtx = barCanvas.getContext("2d");
  const pieCtx = pieCanvas.getContext("2d");

  const projectRes = await fetch(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const projectData = await projectRes.json();
  const projects = Array.isArray(projectData) ? projectData : projectData.projects || [];

  if (projects.length === 0) {
    taskTable.innerHTML = `<tr><td colspan="5">You have no projects yet.</td></tr>`;
    barCanvas.replaceWith(createNoDataMessage("You have no projects. Visit the Projects page to create one."));
    pieCanvas.replaceWith(createNoDataMessage("No data to visualize. Create a project to begin tracking tasks."));
    return;
  }

  const taskRes = await fetch(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const taskData = await taskRes.json();
  const tasks = Array.isArray(taskData) ? taskData : taskData.tasks || [];

  if (tasks.length === 0) {
    taskTable.innerHTML = `<tr><td colspan="5">You don’t have any tasks yet.</td></tr>`;
    barCanvas.replaceWith(createNoDataMessage("No tasks found. Add one below or through a project."));
    pieCanvas.replaceWith(createNoDataMessage("Nothing to visualize yet. Add tasks to see breakdowns."));
    return;
  }

  // Render task table
  taskTable.innerHTML = tasks.map(task => `
    <tr>
      <td>${task.title}</td>
      <td>${task.status}</td>
      <td>${task.priority}</td>
      <td>${task.dueDate}</td>
      <td>
        <button onclick="editTask('${task.id}')">✏️</button>
        <button onclick="deleteTask('${task.id}')">🗑️</button>
      </td>
    </tr>
  `).join("");

  // Build chart data
  const priorityCount = { High: 0, Medium: 0, Low: 0 };
  tasks.forEach(task => {
    if (priorityCount[task.priority]) {
      priorityCount[task.priority]++;
    }
  });

  const counts = [priorityCount.High, priorityCount.Medium, priorityCount.Low];
  const labels = ["High", "Medium", "Low"];
  const barColors = ['#ef4444', '#facc15', '#10b981'];
  const textColor = 'white';

  // Bar Chart
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Task Priority Distribution',
        data: counts,
        backgroundColor: barColors,
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: textColor }
        },
        title: {
          display: true,
          text: 'Task Priority Distribution',
          color: textColor,
          font: { size: 18 }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: '#6b7280' }
        },
        y: {
          ticks: { color: textColor },
          grid: { color: '#6b7280' }
        }
      }
    }
  });

  // Pie Chart
  new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: barColors,
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: textColor }
        },
        title: {
          display: true,
          text: 'Priority Breakdown',
          color: textColor,
          font: { size: 18 }
        }
      }
    }
  });
}

// Task creation
async function createTask(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    title: form.title.value,
    priority: form.priority.value,
    status: form.status.value,
    dueDate: form.dueDate.value
  };

  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Task created");
    loadDashboard();
    form.reset();
  } else {
    alert("Failed to create task");
  }
}

// Task deletion
async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    alert("Deleted");
    loadDashboard();
  } else {
    alert("Failed to delete task");
  }
}

// Task editing
function editTask(id) {
  const newTitle = prompt("Enter new task title:");
  if (!newTitle) return;

  fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title: newTitle })
  }).then(res => {
    if (res.ok) {
      alert("Task updated");
      loadDashboard();
    } else {
      alert("Update failed");
    }
  });
}

// If no charts, show friendly message instead
function createNoDataMessage(text) {
  const div = document.createElement("div");
  div.textContent = text;
  div.style.textAlign = "center";
  div.style.color = "white";
  div.style.backgroundColor = "#494747";
  div.style.padding = "40px";
  div.style.borderRadius = "10px";
  div.style.marginTop = "20px";
  return div;
}
