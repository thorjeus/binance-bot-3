import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  toggleTrader: null
})

export const TraderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  started: false
})

/* ------------- Selectors ------------- */

export const TraderSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const toggleTrader = (state) =>
  state.merge({ started: true })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TOGGLE_TRADER]: toggleTrader
})
