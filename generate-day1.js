// generate-day1.js
const fs = require('fs');
const fetch = require('node-fetch');

// UK grid bounds
const LAT_MIN = 49.9, LAT_MAX = 60.1;
const LON_MIN = -8.7, LON_MAX = 1.8;
const STEP = 0.5; // degrees

async function generateGeoJSON() {
  const features = [];

  for (let lat = LAT_MIN; lat <= LAT_MAX; lat += STEP) {
    for (let lon = LON_MIN; lon <= LON_MAX; lon += STEP) {
      const url = `https://api.open-meteo.com/v1/ukmo?latitude=${lat}&longitude=${lon}&hourly=weathercode&forecast_days=1&timezone=UTC`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        const codes = json.hourly.weathercode;
        const thunderstorm = codes.some(code => [2, 3, 4].includes(code));

        if (thunderstorm) {
          const polygon = [
            [lon, lat],
            [lon + STEP, lat],
            [lon + STEP, lat + STEP],
            [lon, lat + STEP],
            [lon, lat]
          ];

          features.push({
            type: 'Feature',
            properties: {
              DN: 'TSTM',
              LABEL2: 'Thunderstorm Risk'
            },
            geometry: {
              type: 'Polygon',
              coordinates: [polygon]
            }
          });
        }
      } catch (error) {
        console.error(`Error at lat ${lat}, lon ${lon}:`, error.message);
      }
    }
  }

  const geojson = {
    type: 'FeatureCollection',
    features: features
  };

  fs.writeFileSync('day1.geojson', JSON.stringify(geojson, null, 2));
  console.log(`Generated day1.geojson with ${features.length} thunderstorm cells.`);
}

generateGeoJSON();
