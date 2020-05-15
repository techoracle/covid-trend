const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");

function extract(filepath) {
  const csv = fs.readFileSync(filepath);
  const [headers, ...rows] = parse(csv);
  const [UID, iso2, iso3, code3, FIPS, Admin2, province, country, lat, long, combinedKey, ...dates] = headers;

  const countList = {};

  // HACK: CSVs have different date formats
  const normalDates = dates.map(date => {
    const [month, day] = date.split("/");
    return `2020-${formatDayMonth(month)}-${formatDayMonth(day)}`;
  });

  rows.forEach(([UID, iso2, iso3, code3, FIPS, Admin2, province, country, lat, long, combinedKey, ...counts]) => {
    // console.log("Admin2='" + Admin2 + "', province=" + province);
    const city = (Admin2.localeCompare('') === 0)? null : province + " - " + Admin2;
    if (city !== null) countList[city] = countList[city] || {};
    countList[province] = countList[province] || {};
    normalDates.forEach((date, i) => {
      if (city !== null) countList[city][date] = countList[city][date] || 0;
      if (city !== null) countList[city][date] += +counts[i];

      countList[province][date] = countList[province][date] || 0;
      countList[province][date] += +counts[i];
    });
  });
  return [countList, normalDates];
}

// HACK: Now all the names are the same, but leaving this just in case
const patchCountryNames = {};

function updateRegions(dataPath, outputPath, filenameConfirmed, filenameDeaths, filenameRecovered) {
  const [confirmed, dates] = extract(
    path.resolve(dataPath, filenameConfirmed)
  );
  const [deaths] = extract(path.resolve(dataPath, filenameDeaths));
  const [recovered] = extract(path.resolve(dataPath, filenameRecovered));
  const provinces = Object.keys(confirmed);
  const results = {};

  provinces.forEach(province => {
    // Some country names are different in the recovered dataset
    const recoverdProvince = patchCountryNames[province] || province;

    if (!recovered[recoverdProvince]) {
      console.warn(`${recoverdProvince} is missing from the recovered dataset`);
    }

    results[province] = dates.map(date => {
      return {
        Date: date,
        Confirmed: confirmed[province][date],
        Deaths: deaths[province][date],
        Recovered:
          recovered[recoverdProvince] && recovered[recoverdProvince][date] !== null
            ? recovered[recoverdProvince][date]
            : null
      };
    });
  });

  provinces.forEach(province => {
    const oPath = path.join(__dirname, outputPath, getSlug(province) + ".json");
    const result = results[province];
    fs.writeFileSync(oPath, JSON.stringify(result, null, 2));
  });

  const sortedCountries = provinces.sort();
  const provincesJson = [];
  sortedCountries.forEach(province => {
    provincesJson.push({"Province": province, "Slug": getSlug(province), "Country": province});
  });
  provincesJson.sort(getSortOrder("Country"));

  const oPath = path.join(__dirname, outputPath, "provinces.json");
  fs.writeFileSync(oPath, JSON.stringify(provincesJson, null, 2));

//  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
}

function getSlug(country) {
    return country.toLowerCase().split(' ').join('-');
}


//Comparer Function
function getSortOrder(property) {
  return function(a, b) {
    if (a[property] > b[property]) {
      return 1;
    } else if (a[property] < b[property]) {
      return -1;
    }
    return 0;
  }
}

function formatDayMonth(value) {
  const result = (typeof value === 'undefined')? '00' : value;
  return (result.length === 1)? '0' + result : result;
}

module.exports = updateRegions;
