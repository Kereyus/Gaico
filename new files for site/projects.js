// projects.js

const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const projects = await res.json();
  const container = document.querySelector(".center-container");
  container.innerHTML = ""; // Clear previous

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
      <div class="section bottom-section">
        <div class="last-notification">${project.status}</div>
        <div class="unread-count">${(project.notifications || []).length} unread</div>
      </div>
      <div class="hidden-details">
        <div><strong>Current Phase:</strong> ${project.currentPhase}</div>
        <div><strong>Status:</strong> ${project.status}</div>
        <div><strong>Description:</strong> ${project.description}</div>
        <button onclick="editProject(${project.id})">✏️ Edit</button>
        <button onclick="deleteProject(${project.id})">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

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
  } else {
    alert("Failed to create project");
  }
}

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

function editProject(id) {
  // Replace this with your own edit modal/UI
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

function addCreateForm() {
  const container = document.querySelector(".center-container");
  const formWrapper = document.createElement("div");
  formWrapper.innerHTML = `
    <form onsubmit="createProject(event)" style="margin-bottom: 20px;">
      <h3>Create New Project</h3>
      <input name="name" placeholder="Project Name" required /><br/>
      <textarea name="description" placeholder="Description" required></textarea><br/>
      <input type="date" name="startDate" required />
      <input type="date" name="endDate" required />
      <button type="submit">Create</button>
    </form>
  `;
  container.prepend(formWrapper);
}

window.onload = () => {
  //addCreateForm();
  fetchProjects();
};


let formVisible = false;

function toggleCreateForm() {
  const existing = document.getElementById("create-project-form");
  if (existing) {
    existing.remove();
    formVisible = false;
    return;
  }

  const container = document.querySelector(".center-container");
  const formWrapper = document.createElement("div");
  formWrapper.id = "create-project-form";
  formWrapper.innerHTML = `
    <form onsubmit="createProject(event)" style="margin-bottom: 20px;">
      <h3>Create New Project</h3>
      <input name="name" placeholder="Project Name" required /><br/>
      <textarea name="description" placeholder="Description" required></textarea><br/>
      <input type="date" name="startDate" required />
      <input type="date" name="endDate" required />
      <button type="submit" class="login-button">Create</button>
    </form>
  `;
  container.insertBefore(formWrapper, container.children[1]);
  formVisible = true;
}
