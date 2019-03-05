import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { parsePeriod } from '../lib/rsiCalculator'
import ImmutableTransform from '../services/ImmutablePersistenceTransform'
// import { TradeConfig } from '../config'

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
  gatheredData: [],
  chartError: null,
  currentRSI: null,
  recentPeriod: null,
  periods: [],
  periodCount: 0
})

/* ------------- Selectors ------------- */

export const WebsocketSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const getChart = (state, {pair}) => {
  if (pair) {
    return state.merge({ fetchingChart: true, recentPeriod: null, periods: [], periodCount: 0 })
  } else {
    return state.merge({ recentPeriod: null, periods: [], periodCount: 0 })
  }
}

export const getChartSuccess = (state, {data}) => {
  let periods = ImmutableTransform.in(state.periods)
  let updatedPeriods = parsePeriod(data, periods)
  let recentPeriod = updatedPeriods[updatedPeriods.length - 1]

  return state.merge({
    fetchingChart: false,
    periods: updatedPeriods,
    periodCount: state.periodCount + 1,
    recentPeriod
  })
}

export const getChartError = (state, {data}) =>
  state.merge({ fetchingChart: false, chartError: data })

export const resetChartData = (state) =>
  state.merge({ recentPeriod: null, periods: [], periodCount: 0 })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CHART]: getChart,
  [Types.GET_CHART_SUCCESS]: getChartSuccess,
  [Types.GET_CHART_ERROR]: getChartError,
  [Types.RESET_CHART_DATA]: resetChartData
})
