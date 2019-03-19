import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  toggleTrader: null,
  setProfitLossRatio: ['profitPercentage', 'lossPercentage'],
  placeBuyOrder: ['symbol', 'quantity', 'price', 'param'],
  placeBuyOrderSuccess: ['data'],
  placeBuyOrderFailed: ['data'],
  placeSellOrder: ['symbol', 'quantity', 'price', 'param'],
  placeSellOrderSuccess: ['data'],
  placeSellOrderFailed: ['data']
})

export const TraderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  started: false,
  takeProfitRatio: 1,
  stopLossRatio: 0.5,
  takeProfitPrice: null,
  stopLossPrice: null,
  ordering: false,
  buyData: null,
  buyError: null,
  sellData: null,
  sellError: null
})

/* ------------- Selectors ------------- */

export const TraderSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const toggleTrader = (state) =>
  state.merge({ started: !state.started })

export const setProfitLossRatio = (state, { profitPercentage, lossPercentage }) =>
  state.merge({ takeProfitRatio: profitPercentage, stopLossRatio: lossPercentage })

export const buyOrder = (state) =>
  state.merge({ ordering: true, buyError: null, sellError: null })

export const buyOrderSuccess = (state, {data}) => {
  const priceEntered = parseFloat(data.data.price)
  const takeProfitPercentage = state.takeProfitRatio * 0.01 // convert percentage to decimal
  const stopLossPercentage = state.stopLossRatio * 0.01 // convert percentage to decimal

  const takeProfitPrice = priceEntered + (priceEntered * takeProfitPercentage)
  const stopLossPrice = priceEntered - (priceEntered * stopLossPercentage)

  console.log('redux(buyOrderSuccess): ', data, takeProfitPrice, stopLossPrice)
  return state.merge({ ordering: false, buyData: data, takeProfitPrice, stopLossPrice })
}

export const buyOrderFailed = (state, {data}) => {
  console.log('redux(buyOrderFailed): ', data)
  return state.merge({ ordering: false, buyError: data })
}

export const sellOrder = (state) =>
  state.merge({ ordering: true, buyError: null, sellError: null })

export const sellOrderSuccess = (state, {data}) => {
  console.log('redux(sellOrderSuccess): ', data)
  return state.merge({ ordering: false, sellData: data, buyData: null })
}

export const sellOrderFailed = (state, {data}) => {
  console.log('redux(sellOrderFailed): ', data)
  return state.merge({ ordering: false, sellError: data })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TOGGLE_TRADER]: toggleTrader,
  [Types.SET_PROFIT_LOSS_RATIO]: setProfitLossRatio,
  [Types.PLACE_BUY_ORDER]: buyOrder,
  [Types.PLACE_BUY_ORDER_SUCCESS]: buyOrderSuccess,
  [Types.PLACE_BUY_ORDER_FAILED]: buyOrderFailed,
  [Types.PLACE_SELL_ORDER]: sellOrder,
  [Types.PLACE_SELL_ORDER_SUCCESS]: sellOrderSuccess,
  [Types.PLACE_SELL_ORDER_FAILED]: sellOrderFailed
})
