const moment = require('moment');

const jhuFilenames = [
    'time_series_covid19_confirmed_US.csv',
    'time_series_covid19_confirmed_global.csv',
    'time_series_covid19_deaths_US.csv',
    'time_series_covid19_deaths_global.csv',
    'time_series_covid19_recovered_global.csv'
];

const jhuUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';

const jhuDailyUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';

const firstDaily = '2020-01-22';
const csseDateFormat = 'MM-DD-YYYY';

const ruFilenames = [
    'time_series_covid19_confirmed_RU.csv',
    'time_series_covid19_deaths_RU.csv'
];

const ruUrl = 'https://raw.githubusercontent.com/grwlf/COVID-19_plus_Russia/master/csse_covid_19_data/csse_covid_19_time_series/';


function generateDailyUpToToday(startDate) {
  const result = [];
  const today = moment();
  const amount = today.diff(startDate, 'days');
  for (let i = 0; i <= amount - 1; i++) {
    result.push(startDate.clone().add(i, 'days').format(csseDateFormat) + '.csv');
  }
  return result;
}

const jhuInitialLoadDailyFilenames = generateDailyUpToToday( moment(firstDaily) );

module.exports = {jhuFilenames, jhuUrl, ruFilenames, ruUrl, jhuDailyUrl, jhuInitialLoadDailyFilenames};
