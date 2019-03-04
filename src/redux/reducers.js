import { combineReducers } from 'redux'

/* ------------- Assemble The Reducers ------------- */
const reducers = combineReducers({
  trader: require('./TraderRedux').reducer,
  balance: require('./BalanceRedux').reducer,
  websocket: require('./WebsocketRedux').reducer
})

export default reducers
