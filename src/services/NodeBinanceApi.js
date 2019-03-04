const binance = require('node-binance-api')().options({
  APIKEY: process.env.REACT_APP_BINANCE_API_KEY,
  APISECRET: process.env.REACT_APP_BINANCE_API_SECRET,
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
})

const getBalance = () => {
  return new Promise((resolve, reject) => {
    binance.balance((error, balances) => {
      if (error) {
        resolve({ ok: false, data: error })
      } else {
        resolve({ ok: true, data: balances })
      }
    })
  })
}

const getChartData = (pair, timeframe) => {
  return new Promise((resolve, reject) => {
    binance.websockets.chart(pair, timeframe, (symbol, interval, chart) => {
      if (chart && Object.keys(chart).length !== 0) {
        let tick = binance.last(chart);
        const lastPrice = chart[tick].close;
        // Optionally convert 'chart' object to array:
        let ohlc = binance.ohlc(chart);
        // console.log(symbol, ohlc);
        resolve({
          ok: true,
          data: {
            symbol,
            interval,
            lastPrice,
            chart: ohlc
          }
        })
      } else {
        resolve({
          ok: false,
          data: 'Socket error.'
        })
      }
    })
  })
}

export default {
  getBalance,
  getChartData
}
