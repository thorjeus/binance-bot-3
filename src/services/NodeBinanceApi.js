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

const getPriceBySymbol = symbol => {
  return new Promise((resolve, reject) => {
    binance.prices(symbol, (error, resp) => {
      if (error) {
        resolve({ ok: false, data: error })
      } else {
        resolve({ ok: true, data: resp })
      }
    })
  })
}

const buy = (symbol, qty, price, param = {type: 'LIMIT'}) => {
  return new Promise((resolve, reject) => {
    binance.buy(symbol, qty, price, param, (error, resp) => {
      if (error) {
        resolve({ ok: false, data: error })
      } else {
        resolve({ ok: true, data: resp })
      }
    })
  })
}

const sell = (symbol, qty, price, param = {type: 'LIMIT'}) => {
  return new Promise((resolve, reject) => {
    if (!price) { // do market sell if no price is provided
      binance.marketSell(symbol, qty)
      resolve({ ok: true, data: 'Market sell executed.' })
    } else {
      binance.sell(symbol, qty, price, param, (error, resp) => {
        if (error) {
          resolve({ ok: false, data: error })
        } else {
          resolve({ ok: true, data: resp })
        }
      })
    }
  })
}

const cancelOrders = symbol => {
  return new Promise((resolve, reject) => {
    binance.cancelOrders(symbol, (error, resp, symbol) => {
      if (error) {
        resolve({ ok: false, data: error })
      } else {
        resolve({ ok: true, data: resp })
      }
    })
  })
}

const getAllOrders = symbol => {
  return new Promise((resolve, reject) => {
    binance.allOrders(symbol, (error, resp, symbol) => {
      if (error) {
        resolve({ ok: false, data: error })
      } else {
        resolve({ ok: true, data: resp })
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
  getPriceBySymbol,
  buy,
  sell,
  cancelOrders,
  getAllOrders,
  getChartData
}
