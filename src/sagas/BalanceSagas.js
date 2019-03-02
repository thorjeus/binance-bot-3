import { call, put } from 'redux-saga/effects'
import BalanceActions from '../redux/BalanceRedux'

import {getCurrentPosition} from '../lib/utils'

export function * getBalance (api, action) {
  const { pair } = action
  // make the call to the api
  const response = yield call(api.getBalance)

  // success?
  if (response.ok) {
    yield put(BalanceActions.getBalanceSuccess( getCurrentPosition(pair, response.data) ))
  } else {
    yield put(BalanceActions.getBalanceError(response.data))
  }
}
