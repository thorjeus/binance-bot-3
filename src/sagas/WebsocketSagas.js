import { eventChannel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import WebsocketAction from '../redux/WebsocketRedux'

function createEventChannel (mySocket) {
  return eventChannel(emit => {
    mySocket.onmessage = (msg => {
      emit(msg)
    }).bind(this)

    mySocket.onclose = (msg => {
      emit({isClosed: true})
    }).bind(this)

    return () => {
      console.log('socket closes!!!')
      mySocket.close().bind(this)
    }
  })
}

export function * initWebSocketChannel (api, action) {
  const { pair, timeframe } = action

  const mySocket = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@kline_${timeframe}`);
  const channel = yield call(createEventChannel, mySocket);

  while (true) {
    let data
    const msg = yield take(channel)
    if (msg && msg.data) {
      try {
        data = JSON.parse(msg.data)
      } catch (err) {
        data = err
      }
    } else {
      data = msg
    }

    // console.log(data)
    if (data && data.e && data.e === 'kline') {
      yield put(WebsocketAction.getChartSuccess(data))
    } else if (data && data.isClosed) {
      console.log('Websocket connection was closed. Will now proceed to reconnect.')
      yield put(WebsocketAction.resetChartData())
      yield put(WebsocketAction.getChart(pair, timeframe))
    } else {
      yield put(WebsocketAction.getChartError(data))
    }
  }
}


// export function * getChart (api, action) {
//   const { pair, timeframe } = action
//
//   while (true) {
//     try {
//       // make the call to the api
//       const response = yield call(api.getChartData, pair, timeframe)
//
//       // success?
//       if (response.ok) {
//         yield put(WebsocketAction.getChartSuccess(response.data))
//       } else {
//         yield put(WebsocketAction.getChartError(response.data))
//       }
//     } catch (err) {
//       console.log('api error: ',err)
//     }
//   }
// }
