import { takeLatest, all } from 'redux-saga/effects'
import BinanceApi from '../services/NodeBinanceApi'

/* ------------- Types ------------- */

import { BalanceTypes } from '../redux/BalanceRedux'
import { WebsocketTypes } from '../redux/WebsocketRedux'
import { TraderTypes } from '../redux/TraderRedux'

/* ------------- Sagas ------------- */

import { getBalance } from './BalanceSagas'
import { initWebSocketChannel } from './WebsocketSagas'
import { buyOrder, sellOrder } from './TraderSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = BinanceApi

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(BalanceTypes.GET_BALANCE, getBalance, api),
    takeLatest(WebsocketTypes.GET_CHART, initWebSocketChannel, api),
    takeLatest(TraderTypes.PLACE_BUY_ORDER, buyOrder, api),
    takeLatest(TraderTypes.PLACE_SELL_ORDER, sellOrder, api)
  ])
}
