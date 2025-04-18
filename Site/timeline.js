const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

async function fetchTimeline() {
  const res = await fetch(`${API_BASE}/timeline-events`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const events = await res.json();
  const grid = document.querySelector(".timeline-grid");
  const columns = Array.from(grid.children);

  const dateLabels = Array.from(document.querySelectorAll(".timeline-date")).map(e => e.textContent.trim());

  events.forEach(event => {
    const dateStr = new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const columnIndex = dateLabels.findIndex(d => d === dateStr);

    if (columnIndex !== -1) {
      const column = columns[columnIndex];
      const div = document.createElement("div");
      div.className = "timeline-event";
      div.textContent = event.title;
      column.appendChild(div);
    }
  });
}

window.onload = fetchTimeline;
