const jhuFilenames = [
    'time_series_covid19_confirmed_US.csv',
    'time_series_covid19_confirmed_global.csv',
    'time_series_covid19_deaths_US.csv',
    'time_series_covid19_deaths_global.csv',
    'time_series_covid19_recovered_global.csv'
];

const jhuUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';

const ruFilenames = [
    'time_series_covid19_confirmed_RU.csv',
    'time_series_covid19_deaths_RU.csv'
];

const ruUrl = 'https://raw.githubusercontent.com/grwlf/COVID-19_plus_Russia/master/csse_covid_19_data/csse_covid_19_time_series/';

module.exports = {jhuFilenames, jhuUrl, ruFilenames, ruUrl};
