const path = require("path");
const update = require("./update");
const updateRU = require("./updateRU");
const updateUS = require("./updateUS");

const dataPath = path.join(__dirname, "../static/csv");
const outputPathGlobal = "../static/datasource/global";
const outputPathRu = "../static/datasource/ru";
const outputPathUs = "../static/datasource/us";

update(dataPath, outputPathGlobal,
    'time_series_covid19_confirmed_global.csv',
    'time_series_covid19_deaths_global.csv',
    'time_series_covid19_recovered_global.csv');

updateRU(dataPath, outputPathRu,
    'time_series_covid19_confirmed_RU.csv',
    'time_series_covid19_deaths_RU.csv',
    'time_series_covid19_deaths_RU.csv');


updateUS(dataPath, outputPathUs,
    'time_series_covid19_confirmed_US.csv',
    'time_series_covid19_deaths_US.csv',
    'time_series_covid19_deaths_US.csv');



