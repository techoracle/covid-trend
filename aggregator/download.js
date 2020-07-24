'use strict';

const {jhuFilenames, jhuUrl, ruFilenames, ruUrl, jhuDailyUrl, jhuInitialLoadDailyFilenames} = require('./datasource');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function download(url, dir, filename) {
  const thePath = path.resolve(__dirname, dir, filename);
  const writer = fs.createWriteStream(thePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  })
}


jhuFilenames.forEach(filename => {
  download(jhuUrl + filename, '../static/csv', filename);
});

ruFilenames.forEach(filename => {
  download(ruUrl + filename, '../static/csv', filename);
});

jhuInitialLoadDailyFilenames.forEach(filename => {
  download(jhuDailyUrl + filename, '../static/csv/daily', filename);
});

module.exports = download;
