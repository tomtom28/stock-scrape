const request = require('request')
const cheerio = require('cheerio')


let stockTickers = ["amzn", "googl"]

let i = 0;
request('http://money.cnn.com/quote/forecast/forecast.html?symb='+stockTickers[i], function (error, response, body) {

  const $ = cheerio.load(body)

  let print = $("#wsod_forecasts p").text()



});