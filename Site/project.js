const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function fetchProjectDetails() {
  const projectId = getQueryParam("id");
  if (!projectId) return alert("No project ID provided");

  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const project = await res.json();

  document.querySelector(".project-description h1").textContent = project.name;
  document.querySelector(".project-description p").textContent = project.description;

  const activity = document.querySelector(".project-activity ul");
  activity.innerHTML = project.activityLog.map(a => `<li>[${a.timestamp}] ${a.entry}</li>`).join("");

  const ctx = document.getElementById("statusChart").getContext("2d");
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Complete', 'Under Review', 'Incomplete'],
      datasets: [{
        data: [project.progress || 0, 100 - project.progress || 0, 0],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white' }
        },
        title: { display: false }
      }
    }
  });
}

window.onload = fetchProjectDetails;
