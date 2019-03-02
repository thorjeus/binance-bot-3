import { combineReducers } from 'redux'

/* ------------- Assemble The Reducers ------------- */
const reducers = combineReducers({
  trader: require('./TraderRedux').reducer,
})

export default reducers
