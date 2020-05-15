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
    countList[province] = countList[province] || {};
    normalDates.forEach((date, i) => {
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
    provincesJson.push({"Province": province, "Slug": getSlug(province), "Country": getNativeRegionName(province)});
  });
  provincesJson.sort(getSortOrder("Country"));

  const oPath = path.join(__dirname, outputPath, "provinces.json");
  fs.writeFileSync(oPath, JSON.stringify(provincesJson, null, 2));

//  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
}

function getSlug(country) {
    return country.toLowerCase().split(' ').join('-');
}

function getNativeRegionName(province) {
  const REGIONS=[['Moscow','Москва'],
    ['Saint Petersburg','Санкт-Петербург'],
    ['Moscow oblast','Московская область'],
    ['Samara oblast','Самарская область'],
    ["Saha republic","Республика Саха (Якутия)"],
    ["Sverdlov oblast","Свердловская область"],
    ["Kaliningrad oblast","Калининградская область"],
    ["Kirov oblast","Кировская область"],
    ["Novosibirsk oblast","Новосибирская область"],
    ["Krasnoyarskiy kray","Красноярский край"],
    ["Tambov oblast","Тамбовская область"],
    ["Lipetsk oblast","Липецкая область"],
    ["Tver oblast","Тверская область"],
    ["Habarovskiy kray","Хабаровский край"],
    ["Tumen oblast","Тюменская область"],
    ["Tula oblast","Тульская область"],
    ["Perm oblast","Пермский край"],
    ["Nizhegorodskaya oblast","Нижегородская область"],
    ["Krasnodarskiy kray","Краснодарский край"],
    ["Voronezh oblast","Воронежская область"],
    ["Kemerovo oblast","Кемеровская область"],
    ["Republic of Hakassia","Республика Хакасия"],
    ["Murmansk oblast","Мурманская область"],
    ["Komi republic","Республика Коми"],
    ["Kaluga oblast","Калужская область"],
    ["Ivanovo oblast","Ивановская область"],
    ["Zabaykalskiy kray","Забайкальский край"],
    ["Tomsk oblast","Томская область"],
    ["Arkhangelsk oblast","Архангельская область"],
    ["Ryazan oblast","Рязанская область"],
    ["Republic of Chuvashia","Чувашская Республика"],
    ["Ulianovsk oblast","Ульяновская область"],
    ["Yaroslavl oblast","Ярославская область"],
    ["Pensa oblast","Пензенская область"],
    ["Belgorod oblast","Белгородская область"],
    ["Hanty-Mansiyskiy AO","Ханты-Мансийский АО"],
    ["Leningradskaya oblast","Ленинградская область"],
    ["Orenburg oblast","Оренбургская область"],
    ["Saratov oblast","Саратовская область"],
    ["Republic of Tatarstan","Республика Татарстан"],
    ["Kurgan oblast","Курганская область"],
    ["Republic of Kabardino-Balkaria","Кабардино-Балкарская Республика"],
    ["Cheliabinsk oblast","Челябинская область"],
    ["Stavropolskiy kray","Ставропольский край"],
    ["Briansk oblast","Брянская область"],
    ["Republic of Udmurtia","Удмуртская Республика"],
    ["Novgorod oblast","Новгородская область"],
    ["Republic of Crimea","Республика Крым"],
    ["Republic of Bashkortostan","Республика Башкортостан"],
    ["Chechen republic","Чеченская Республика"],
    ["Primorskiy kray","Приморский край"],
    ["Volgograd oblast","Волгоградская область"],
    ["Orel oblast","Орловская область"],
    ["Pskov oblast","Псковская область"],
    ["Rostov oblast","Ростовская область"],
    ["Republic of Buriatia","Республика Бурятия"],
    ["Republic of Mordovia","Республика Мордовия"],
    ["Republic of Dagestan","Республика Дагестан"],
    ["Sakhalin oblast","Сахалинская область"],
    ["Kostroma oblast","Костромская область"],
    ["Smolensk oblast","Смоленская область"],
    ["Republic of Adygeia","Республика Адыгея"],
    ["Omsk oblast","Омская область"],
    ["Irkutsk oblast","Иркутская область"],
    ["Amursk oblast","Амурская область"],
    ["Altayskiy kray","Алтайский край"],
    ["Vladimir oblast","Владимирская область"],
    ["Vologda oblast","Вологодская область"],
    ["Republic of Kalmykia","Республика Калмыкия"],
    ["Republic of Mariy El","Республика Марий Эл"],
    ["Republic of Chuvashia","Республика Чувашия"],
    ["Astrahan oblast","Астраханская область"],
    ["Magadan oblast","Магаданская область"],
    ["Sevastopol","Севастополь"],
    ["Kursk oblast","Курская область"],
    ["Republic of North Osetia - Alania","Республика Северная Осетия — Алания"],
    ["Yamalo-Nenetskiy AO","Ямало-Ненецкий автономный округ"],
    ["Ingushetia republic","Республика Ингушетия"],
    ["Jewish Autonomous oblast","Еврейская автономная область"],
    ["Kamchatskiy kray","Камчатский край"],
    ["Republic of Karelia", "Республика Карелия"],
    ["Republic of Karachaevo-Cherkessia", "Карачаево-Черкесская Республика"],
    ["Republic of Tyva", "Республика Тыва"],
    ["Nenetskiy autonomous oblast", "Ненецкий автономный округ"],
    ["Chukotskiy autonomous oblast", "Чукотский автономный округ"],
    ["Altay republic", "Республика Алтай"]
  ];

  let result = province;
  REGIONS.forEach(([original, translate]) => {
    if (original.localeCompare(province) === 0) {
      // console.log("original=" + original + ", translate=" + translate + ", province=" + province);
      result = translate;
    }
  });
  return result;
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
