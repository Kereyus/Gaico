const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

async function loadDashboard() {
  const taskTable = document.getElementById("taskTable");
  const barCtx = document.getElementById("barChart").getContext("2d");
  const pieCtx = document.getElementById("pieChart").getContext("2d");

//tasks
  const res = await fetch(`${API_BASE}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const tasks = await res.json();

  taskTable.innerHTML = tasks.map(task => `
    <tr>
      <td>${task.title}</td>
      <td>${task.status}</td>
      <td>${task.priority}</td>
      <td>${task.dueDate}</td>
    </tr>
  `).join("");

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
        legend: { labels: { color: textColor } },
        title: {
          display: true,
          text: 'Task Priority Distribution',
          color: textColor,
          font: { size: 18 }
        }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: '#6b7280' } },
        y: { ticks: { color: textColor }, grid: { color: '#6b7280' } }
      }
    }
  });

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
        legend: { labels: { color: textColor } },
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

window.onload = loadDashboard;
