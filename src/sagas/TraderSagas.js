import { call, put } from 'redux-saga/effects'
import TraderActions from '../redux/TraderRedux'
import {parseResponse} from '../lib/utils'
import { TradeConfig } from '../config'

export function * buyOrder (api, action) {
  const { symbol, quantity, price, param } = action
  
  if (TradeConfig.testing) {
    const dummyData = {
      symbol: symbol,
      orderId: 4480717,
      clientOrderId: 'te38xGILZUXrPZHnTQPH6h',
      transactTime: 1509049732437,
      price: price,
      origQty: quantity,
      executedQty: '5.00000000',
      status: 'FILLED',
      timeInForce: 'GTC',
      type: 'LIMIT',
      side: 'BUY'
    }
    yield put(TraderActions.placeBuyOrderSuccess(dummyData))
  } else {
    // make the call to the api
    const response = yield call(api.buy, symbol, quantity, price, param)

    // success?
    if (response.ok) {
      // console.log('buyOrder saga(success):', response.data)
      yield put(TraderActions.placeBuyOrderSuccess(parseResponse(response.data)))
    } else {
      console.log('buyOrder saga(failed):', response.data)
      yield put(TraderActions.placeBuyOrderFailed(parseResponse(response.data)))
    }
  }
}

export function * sellOrder (api, action) {
  const { symbol, quantity, price, param } = action

  if (TradeConfig.testing) {
    const dummyData = {
      symbol: symbol,
      orderId: 4480717,
      clientOrderId: 'te38xGILZUXrPZHnTQPH6h',
      transactTime: 1509049732437,
      price: price,
      origQty: quantity,
      executedQty: '5.00000000',
      status: 'FILLED',
      timeInForce: 'GTC',
      type: 'LIMIT',
      side: 'SELL'
    }
    yield put(TraderActions.placeSellOrderSuccess(dummyData))

  } else {
    // make the call to the api
    const response = yield call(api.sell, symbol, quantity, price, param)

    // success?
    if (response.ok) {
      // console.log('sellOrder saga(success):', response.data)
      yield put(TraderActions.placeSellOrderSuccess(parseResponse(response.data)))
    } else {
      console.log('sellOrder saga(failed):', response.data)
      yield put(TraderActions.placeSellOrderFailed(parseResponse(response.data)))
    }
  }
}
