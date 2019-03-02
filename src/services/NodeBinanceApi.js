const binance = require('node-binance-api')().options({
  APIKEY: process.env.REACT_APP_BINANCE_API_KEY,
  APISECRET: process.env.REACT_APP_BINANCE_API_SECRET,
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
})

const getBalance = cb => {
  return new Promise((resolve, reject) => {
    binance.balance((error, balances) => {
      // console.log("balances()", balances);
      // console.log("ETH balance: ", balances.ETH.available);
      if (error) {
        resolve({ ok: false, data: error })
      } else {
        resolve({ ok: true, data: balances })
      }
    })
  })
}

export default {
  getBalance
}
