const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

// Fetch and display all projects
async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const projects = await res.json();
  const container = document.querySelector(".center-container");

  // Remove existing project cards (but not the form)
  const cards = container.querySelectorAll(".project-card");
  cards.forEach(card => card.remove());

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <div class="section top-section">
        <div class="project-name">
          <a href="project.html?id=${project.id}">${project.name}</a>
        </div>
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress" style="width: ${project.progress || 0}%"></div>
          </div>
          <div class="progress-percent">${project.progress || 0}%</div>
        </div>
      </div>
      <div class="section middle-section">
        <div class="last-edited">Last edited: ${project.lastEdited || "N/A"}</div>
        <div class="dates">
          Start: ${project.startDate || "N/A"}<br/>
          Est. End: ${project.endDate || "N/A"}
        </div>
      </div>
      <div class="section bottom-section toggle-trigger">
        <div class="last-notification">${project.status || "No data so far."}</div>
        <div class="unread-count">${(project.notifications?.length || 0)} unread</div>
      </div>
      <div class="hidden-details">
        <div><strong>Current Phase:</strong> ${project.currentPhase || "No data so far."}</div>
        <div><strong>Status:</strong> ${project.status || "No data so far."}</div>
        <div><strong>Description:</strong> ${project.description || "No data so far."}</div>
        <div><strong>Notifications:</strong> ${(project.notifications?.length || 0) || "No data so far."}</div>
        <button onclick="editProject(${project.id})">✏️ Edit</button>
        <button onclick="deleteProject(${project.id})">🗑️ Delete</button>
      </div>
    `;

    // Enable toggle animation
    const toggleTrigger = card.querySelector(".toggle-trigger");
    const detailsSection = card.querySelector(".hidden-details");
    toggleTrigger.addEventListener("click", () => {
      detailsSection.classList.toggle("show");
    });

    container.appendChild(card);
  });
}

// Handle new project creation
async function createProject(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    description: form.description.value,
    startDate: form.startDate.value,
    endDate: form.endDate.value
  };

  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Project created!");
    fetchProjects();
    form.reset();

    // Close the form UI
    document.getElementById("create-project-card").classList.add("hidden");
    document.getElementById("create-toggle-button").classList.remove("hidden");
  } else {
    alert("Failed to create project");
  }
}

// Handle project deletion
async function deleteProject(id) {
  if (!confirm("Delete this project?")) return;

  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    alert("Deleted.");
    fetchProjects();
  } else {
    alert("Delete failed.");
  }
}

// Handle project name editing
function editProject(id) {
  const newName = prompt("New project name:");
  if (!newName) return;

  fetch(`${API_BASE}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name: newName })
  }).then(res => {
    if (res.ok) {
      alert("Updated.");
      fetchProjects();
    } else {
      alert("Update failed.");
    }
  });
}

// Load projects on page load
window.onload = () => {
  fetchProjects();
};
