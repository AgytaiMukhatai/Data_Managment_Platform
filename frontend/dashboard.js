// dashboard.js

// Données fictives pour le tableau
const datasets = [
    { name: "audio_data.csv", size: "2.1 Mo", type: "Audio", date: "2025-04-01" },
    { name: "imageset.zip", size: "18.4 Mo", type: "Image", date: "2025-04-01" },
    { name: "video_labels.json", size: "1.3 Mo", type: "Vidéo", date: "2025-04-01" }
  ];
  
  // Remplir le tableau
  const tableBody = document.getElementById("datasetTable");
  datasets.forEach(file => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${file.name}</td>
      <td>${file.size}</td>
      <td>${file.type}</td>
      <td>${file.date}</td>
    `;
    tableBody.appendChild(row);
  });
  
  // Graphique Chart.js
  const ctx = document.getElementById("statsChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Audio", "Image", "Vidéo", "Texte", "Numérique"],
      datasets: [{
        label: "Fichiers chargés",
        data: [4, 6, 3, 2, 5],
        backgroundColor: [
          "#2ecc71",
          "#3498db",
          "#e67e22",
          "#9b59b6",
          "#1abc9c"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Répartition des types de fichiers"
        }
      }
    }
  });
  
  // Déconnexion
  document.getElementById("logout").addEventListener("click", () => {
    window.location.href = "login.html";
  });
  