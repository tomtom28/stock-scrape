const fs = require('fs')
const parse = require('csv-parse');

// Read Stock Tickers from CSV File
module.exports.getStockTickers = function(_callback) {
  let csvData = [];
  fs.createReadStream('tmp/tickers.csv')
      .pipe(parse({delimiter: ','}))
      .on('data', function(csvrow) {
          csvData.push(csvrow);        
      })
      .on('end',function() {
        return _callback(csvData);
      });
}