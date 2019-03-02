import { takeLatest, all } from 'redux-saga/effects'
import BinanceApi from '../services/NodeBinanceApi'

/* ------------- Types ------------- */

import { BalanceTypes } from '../redux/BalanceRedux'

/* ------------- Sagas ------------- */

import { getBalance } from './BalanceSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = BinanceApi

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(BalanceTypes.GET_BALANCE, getBalance, api)
  ])
}
