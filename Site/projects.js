const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const projects = await res.json();
  const container = document.querySelector(".center-container");
  container.innerHTML = "";    // clear existing? should work

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="section top-section">
        <div class="project-name"><a href="project.html?id=${project.id}">${project.name}</a></div>
        <div class="progress-wrapper">
          <div class="progress-bar"><div class="progress" style="width: ${project.progress || 0}%"></div></div>
          <div class="progress-percent">${project.progress || 0}%</div>
        </div>
      </div>
      <div class="section middle-section">
        <div class="last-edited">Last edited: ${project.lastEdited}</div>
        <div class="dates">Start: ${project.startDate}<br/>Est. End: ${project.endDate}</div>
      </div>
      <div class="section bottom-section" onclick="toggleDetails(this)">
        <div class="last-notification">${project.status}</div>
        <div class="unread-count">${(project.notifications || []).length} unread</div>
      </div>
      <div class="hidden-details">
        <div><strong>Current Phase:</strong> ${project.currentPhase}</div>
        <div><strong>Status:</strong> ${project.status}</div>
        <div><strong>Description:</strong> ${project.description}</div>
        <div><strong>Notifications:</strong></div>
        ${(project.notifications || []).map(n => `<div>${n.message}</div>`).join("")}
      </div>
    `;
    container.appendChild(card);
  });
}

function toggleDetails(btn) {
  const details = btn.nextElementSibling;
  details.classList.toggle("show");
}

window.onload = fetchProjects;
