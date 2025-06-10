const fs = require('fs');
const parse = require('csv-parse/lib/sync');

function getTestDataFromCsv(csvPath) {
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ','
  });
  return records;
}

module.exports = getTestDataFromCsv;
