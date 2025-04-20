const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

async function fetchTimeline() {
  const res = await fetch(`${API_BASE}/timeline-events`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const events = await res.json();
  renderTimeline(events);
}

function renderTimeline(events) {
  const grid = document.querySelector(".timeline-grid");
  const columns = Array.from(grid.children);
  const dateLabels = Array.from(document.querySelectorAll(".timeline-date")).map(e => e.textContent.trim());

  events.forEach(event => {
    const dateStr = new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const index = dateLabels.findIndex(d => d === dateStr);
    if (index !== -1) {
      const col = columns[index];
      const div = document.createElement("div");
      div.className = "timeline-event";
      div.innerHTML = `${event.title}
        <button onclick="editEvent('${event.id}')">✏️</button>
        <button onclick="deleteEvent('${event.id}')">🗑️</button>`;
      col.appendChild(div);
    }
  });
}

async function createEvent(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    title: form.title.value,
    date: form.date.value,
    description: form.description.value
  };

  const res = await fetch(`${API_BASE}/timeline-events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Event created");
    fetchTimeline();
    form.reset();
  } else {
    alert("Failed to create event");
  }
}

function editEvent(id) {
  const newTitle = prompt("New title for event:");
  if (!newTitle) return;

  fetch(`${API_BASE}/timeline-events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title: newTitle })
  }).then(res => {
    if (res.ok) {
      alert("Updated");
      fetchTimeline();
    } else {
      alert("Failed to update");
    }
  });
}

async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;
  const res = await fetch(`${API_BASE}/timeline-events/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    alert("Deleted");
    fetchTimeline();
  } else {
    alert("Failed to delete");
  }
}

window.onload = fetchTimeline;
