const fs = require('fs');
const { parse } = require('csv-parse/sync');

// Funktion zum Platzhalter-Auswerten von Datumsfeldern
function resolveDynamicDate(placeholder) {
  const match = placeholder.match(/\{DATE\[\[(.*?)\]\[(.*?)\]\]\}/i);
  if (!match) return placeholder;

  const offset = match[1]; // z. B. "+1M+1d"
  const format = match[2]; // z. B. "MM/dd/yyyy"

  let date = new Date();

  const parts = offset.match(/([+-]?\d+)([dMy])/gi);
  if (parts) {
    parts.forEach(part => {
      const [, value, unit] = part.match(/([+-]?\d+)([dMy])/);
      const num = parseInt(value);
      if (unit === 'd') date.setDate(date.getDate() + num);
      if (unit === 'M') date.setMonth(date.getMonth() + num);
      if (unit === 'y') date.setFullYear(date.getFullYear() + num);
    });
  }

  const map = {
    dd: String(date.getDate()).padStart(2, '0'),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    yyyy: date.getFullYear()
  };

  return format.replace(/dd|MM|yyyy/g, match => map[match]);
}

// Datei lesen
const csv = fs.readFileSync(__dirname + '/Scenarios_Vehicle_Insurance_App.csv', 'utf8');
const records = parse(csv, { columns: true, skip_empty_lines: true });

// Werte und Platzhalter verarbeiten
const data = {};
records.forEach(row => {
  const scenarioName = row['Scenarios'] || row['Scenario'] || row['Attributes'] || Object.keys(row)[0];
  const resolved = {};
  for (const key in row) {
    resolved[key] = typeof row[key] === 'string' && row[key].includes('{DATE') 
      ? resolveDynamicDate(row[key])
      : row[key];
  }
  data[scenarioName] = resolved;
});

module.exports = data;
