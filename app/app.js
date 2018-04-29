const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const getTickersFromCsv = require('./getTickersFromCsv.js')

// Today's Date
let d = new Date()
let date = d.getFullYear() + "-" + (d.getMonth()+1) + '-' + d.getDate()


// Stock Tickers to Scrape
getTickersFromCsv.getStockTickers(function(stockTickers) {

  // Loop Over Stock Tickers
  let predictionCsvLines = [];
  for (let i = 0; i < stockTickers.length; i++) {
    request('http://money.cnn.com/quote/forecast/forecast.html?symb='+stockTickers[i], function (error, response, body) {

      // Parse HTML
      let $ = cheerio.load(body)
      let stockInfo = $("#wsod_forecasts p").text()
      
      // Parse for Last Price, Est Median, Est Low, Est High, Buy/Hold/Sell
      let ticker = stockTickers[i]
      let lastPrice = parseByPhrase("last price of ", ".The", stockInfo).trim()
      let estMedian = parseByPhrase("median target of ", ", with", stockInfo).trim()
      let estLow = parseByPhrase("low estimate of ", ". ", stockInfo).trim()
      let estHigh = parseByPhrase("high estimate of ", "and ", stockInfo).trim()
      let whatToDo = parseByPhrase("investment analysts is to ", "stock", stockInfo).trim()

      // Write to comma seperated string
      let csvLine = stockTickers[i] + "," + date + "," + lastPrice + "," + estMedian + "," + estLow + "," + estHigh + "," + whatToDo + "\n"
      fs.appendFile('tmp/predictions.csv', csvLine, function (err) {
        if (err) {
          console.log('[ERROR] Prediction for ' + ticker + ' failed!');
        } 
        console.log('[LOG] Prediction for ' + ticker + ' collected.');
      });


    });
  }

});


// Pull Out Values using start and end strings
function parseByPhrase(phraseStart, phraseEnd, textblock) {

  let stringStart = textblock.indexOf(phraseStart) + phraseStart.length
  let stringEnd = textblock.indexOf(phraseEnd, stringStart)
  let parsedItem = textblock.substring(stringStart, stringEnd)

  // Remove any commas from number
  let locOfComma = parsedItem.indexOf(",")
  if (locOfComma > 0) {
    let parsedItemLeft = parsedItem.substring(0,locOfComma)
    let parsedItemRight = parsedItem.substring(locOfComma + 1)
    parsedItem = parsedItemLeft+parsedItemRight
  }

  return parsedItem
}