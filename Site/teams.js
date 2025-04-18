const API_BASE = "http://localhost:8080";
const token = localStorage.getItem("access_token");

async function fetchTeams() {
  const res = await fetch(`${API_BASE}/teams`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const teams = await res.json();
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  teams.forEach(team => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${team.id}</td>
      <td>${team.name}</td>
      <td>${team.productOwner}</td>
      <td>${team.productManager}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.onload = fetchTeams;
