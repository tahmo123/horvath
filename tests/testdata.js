const fs = require('fs');
const { parse } = require('csv-parse/sync');

const csv = fs.readFileSync(__dirname + '/Scenarios_Vehicle_Insurance_App.csv', 'utf8');
const records = parse(csv, { columns: true, skip_empty_lines: true });

// Optional: nach Szenarioname indizieren
const data = {};
records.forEach(row => {
  const scenarioName = row['Scenarios'] || row['Scenario'] || row['Attributes'] || Object.keys(row)[0];
  data[scenarioName] = row;
});

module.exports = data;
