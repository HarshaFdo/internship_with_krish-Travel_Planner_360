import axios from "axios";

const API_VERSION = process.env.API_VERSION || "v1";
const BASE_URL = "http://localhost:3000";

console.log("Travel Planner Sample Client");
console.log(`API Version: ${API_VERSION.toUpperCase()}`);
console.log("-----------------------------------------\n");

async function testSearchEndpoint() {
  console.log("Testing /trips/search Endpoint");
  console.log("");

  const testCases = [
    { from: "CMB", to: "BKK", date: "2025-12-01", name: "Bankok" },
    { from: "CMB", to: "MLE", date: "2025-10-20", name: "Maldives" },
    { from: "CMB", to: "HKT", date: "2025-11-05", name: "Phuket" },
  ];

  for (const test of testCases) {
    try {
      const url = `${BASE_URL}/${API_VERSION}/trips/search`;
      console.log(`Testing:${test.name} (${test.from} -> ${test.to})`);

      const response = await axios.get(url, {
        params: { from: test.from, to: test.to, date: test.date },
      });

      console.log(`status: ${response.status}`);
      console.log(`flights: ${response.data.flights?.length || 0}`);
      console.log(`hotels: ${response.data.hotels?.length || 0}`);

      if (response.data.weather) {
        console.log("weather: yes - v2 feature");
        console.log(
          `forecast: ${response.data.weather.forecast?.length || 0} days`
        );
      } else {
        console.log(`weather: no - v1 response`);
      }

      if (response.data.version) {
        console.log(`version tag: ${response.data.version}`);
      }

      console.log("");
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }
  }
}

async function showMetrics() {
  console.log("API adoption metrics");
  console.log("");

  try {
    const response = await axios.get(`${BASE_URL}/metrics`);
    const m = response.data;

    console.log(`v1 Requests: ${m.v1Requests} (${m.v1Percentage})`);
    console.log(`v2 Requests: ${m.v2Requests} (${m.v2Percentage})`);
    console.log(`Total Requests: ${m.totalRequests}`);
    console.log(`Service Uptime: ${m.uptime}`);
    console.log("");

    const v2Adoption = parseFloat(m.v2Percentage);
    if (v2Adoption >= 95) {
      console.log("v2 adoption>95% - Ready to retire v1");
    } else if (v2Adoption >= 50) {
      console.log("v2 adoption>50% - 0n track");
    } else {
      console.log("v2 adoption <50% - Early phase");
    }
    console.log("");
  } catch (error) {
    console.log(`Could not fetch metrics\n`);
  }
}

async function main() {
  await testSearchEndpoint();
  await showMetrics();

  console.log("Tests complete");
  console.log("\n Switch API versions:");
  console.log("npm run test:v1 -> V1 - flights + hotels");
  console.log("npm run test:v2 -> V2 - flights + hotels + weather \n");
}

main().catch(console.error);


// Test V1 API
// API_VERSION=v1 node index.js

// Test V2 API
// API_VERSION=v2 node index.js