import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
// import { gatherChartData } from '../lib/utils'
import ImmutableTransform from '../services/ImmutablePersistenceTransform'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getChart: ['pair', 'timeframe'],
  getChartSuccess: ['data'],
  getChartError: ['data'],
  resetChartData: null
})

export const WebsocketTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingChart: false,
  chartData: null,
  last50Data: [],
  chartError: null
})

/* ------------- Selectors ------------- */

export const WebsocketSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const getChart = (state, {pair}) => {
  if (pair) {
    return state.merge({ fetchingChart: true, chartData: null, chartError: null })
  } else {
    return state.merge({ chartData: null, last50Data: null })
  }
}

export const getChartSuccess = (state, {data}) => {
  let prevChartData = state.chartData
  let newLast50Data = ImmutableTransform.in(state.last50Data)

  let newChartData = {
    type: data.e,
    eventTime: data.E,
    symbol: data.s,
    currentPrice: data.k.c,
    priceMovement: '',
    info: {
      startTime: data.k.t,
      closeTime: data.k.T,
      symbol: data.k.s,
      interval: data.k.i,
      firstTrade: data.k.f,
      lastTrade: data.k.L,
      openPrice: data.k.o,
      closePrice: data.k.c,
      highestPrice: data.k.h,
      lowestPrice: data.k.l,
      baseAssessVolume: data.k.v,
      numberOfTrades: data.k.n,
      isClosed: data.k.x,
      assetVolume: data.k.q,
      buyBaseAssessVolume: data.k.V,
      buyQuoteAssetVolume: data.k.Q,
      ignore: data.k.B
    }
  }

  if (!prevChartData) {
    newChartData.lastPrice = data.k.c
  } else {
    newChartData.lastPrice = prevChartData.currentPrice
  }

  if (newChartData.currentPrice < newChartData.lastPrice) {
    newChartData.priceMovement = 'down'
  } else if (newChartData.currentPrice > newChartData.lastPrice) {
    newChartData.priceMovement = 'up'
  }

  if (newLast50Data.length > 49) { // maintain last 50 chart data
    newLast50Data.shift()
  }
  newLast50Data.push(newChartData)

  return state.merge({ fetchingChart: false, chartData: newChartData, last50Data: newLast50Data })
}

export const getChartError = (state, {data}) =>
  state.merge({ fetchingChart: false, chartError: data })

export const resetChartData = (state) =>
  state.merge({ chartData: null, last50Data: [] })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CHART]: getChart,
  [Types.GET_CHART_SUCCESS]: getChartSuccess,
  [Types.GET_CHART_ERROR]: getChartError,
  [Types.RESET_CHART_DATA]: resetChartData
})
