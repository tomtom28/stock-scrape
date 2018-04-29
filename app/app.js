const request = require('request')
const cheerio = require('cheerio')


// Today's Date
let d = new Date()
let date = d.getFullYear() + "-" + (d.getMonth()+1) + '-' + d.getDate()

// Stock Tickers to Scrape
let stockTickers = ["amzn", "googl"]


// Future Loop (note will need to handle async)
let i = 0;
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
  
  // Write to comma seperated String
  let csvLine = stockTickers[i] + "," + date + "," + lastPrice + "," + estMedian + "," + estLow + "," + estHigh + "," + whatToDo

  console.log(csvLine)
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