import { combineReducers } from 'redux'

/* ------------- Assemble The Reducers ------------- */
const reducers = combineReducers({
  trader: require('./TraderRedux').reducer,
  balance: require('./BalanceRedux').reducer
})

export default reducers
