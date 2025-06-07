const map = L.map('map').setView([54.5, -3], 6); // Center on UK

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Risk colors
const riskColors = {
  'TSTM': '#c1e9c1',
  'MRGL': '#66a366',
  'SLGT': '#ffe066',
  'ENH': '#ffa366',
  'MDT': '#e06666',
  'HIGH': '#ee99ee'
};

function getColor(riskCode) {
  return riskColors[riskCode] || '#999';
}

function style(feature) {
  const risk = feature.properties.DN;
  return {
    color: '#444',
    weight: 1,
    fillColor: getColor(risk),
    fillOpacity: 0.6
  };
}

function onEachFeature(feature, layer) {
  const label = feature.properties.LABEL2 || feature.properties.DN || 'Thunderstorm Risk';
  layer.bindPopup(`<strong>${label}</strong>`);
}

// Load your own forecast GeoJSON
fetch('day1.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
    addLegend();
  });

function addLegend() {
  const legend = document.getElementById('legend');
  legend.innerHTML = '<strong>Thunderstorm Outlook</strong><br>';
  for (const [key, color] of Object.entries(riskColors)) {
    legend.innerHTML += `<span class="legend-color" style="background:${color}"></span> ${key}<br>`;
  }
}
