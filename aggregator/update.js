const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");

const FILENAME_CONFIRMED = "data.csv";
const FILENAME_DEATHS = "data.csv";
const FILENAME_RECOVERED = "data.csv";

function extract(filepath) {
  const csv = fs.readFileSync(filepath);
  const [headers, ...rows] = parse(csv);
  const [province, country, lat, long, ...dates] = headers;

  const countList = {};

  // HACK: CSVs have different date formats
  const normalDates = dates.map(date => {
    const [month, day] = date.split("/");
    return `2020-${month}-${day}`;
  });

  rows.forEach(([province, country, lat, long, ...counts]) => {
    countList[country] = countList[country] || {};
    normalDates.forEach((date, i) => {
      countList[country][date] = countList[country][date] || 0;
      countList[country][date] += +counts[i];
    });
  });
  return [countList, normalDates];
}

// HACK: Now all the names are the same, but leaving this just in case
const patchCountryNames = {};

function update(dataPath, outputPath, filenameConfirmed, filenameDeaths, filenameRecovered) {
  const [confirmed, dates] = extract(
    path.resolve(dataPath, filenameConfirmed)
  );
  const [deaths] = extract(path.resolve(dataPath, filenameDeaths));
  const [recovered] = extract(path.resolve(dataPath, filenameRecovered));
  const countries = Object.keys(confirmed);
  const results = {};

  countries.forEach(country => {
    // Some country names are different in the recovered dataset
    const recoverdCountry = patchCountryNames[country] || country;

    if (!recovered[recoverdCountry]) {
      console.warn(`${recoverdCountry} is missing from the recovered dataset`);
    }

    results[country] = dates.map(date => {
      return {
        Date: date,
        Confirmed: confirmed[country][date],
        Deaths: deaths[country][date],
        Recovered:
          recovered[recoverdCountry] && recovered[recoverdCountry][date] !== null
            ? recovered[recoverdCountry][date]
            : null
      };
    });
  });

  countries.forEach(country => {
    const outputPath = path.join(__dirname, "../static/datasource/global", getSlug(country) + ".json");
    const result = results[country];
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  });

  const sortedCountries = countries.sort();
  const countriesJson = [];
  sortedCountries.forEach(country => {
    countriesJson.push({"Country": country, "Slug": getSlug(country)});
  });

  const oPath = path.join(__dirname, "../static/datasource/global", "countries.json");
  fs.writeFileSync(oPath, JSON.stringify(countriesJson, null, 2));

//  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
}

function getSlug(country) {
    return country.toLowerCase().split(' ').join('-');
}

module.exports = update;
