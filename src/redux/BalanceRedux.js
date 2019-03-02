import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getBalance: ['pair'],
  getBalanceSuccess: ['data'],
  getBalanceError: ['data']
})

export const BalanceTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  balance: null,
  error: null
})

/* ------------- Selectors ------------- */

export const BalanceSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const getBalance = (state, {pair}) => {
  if (pair !== '') {
    return state.merge({ fetching: true })
  } else {
    return state.merge({ balance: null })
  }
}

export const getBalanceSuccess = (state, {data}) =>
  state.merge({ fetching: false, balance: data })

export const getBalanceError = (state, {data}) =>
  state.merge({ fetching: false, error: data })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_BALANCE]: getBalance,
  [Types.GET_BALANCE_SUCCESS]: getBalanceSuccess,
  [Types.GET_BALANCE_ERROR]: getBalanceError
})
