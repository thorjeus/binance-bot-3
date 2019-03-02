import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'

import rootReducer from './reducers'
import rootSaga from '../sagas'
import { ReduxPersist } from '../config'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const persistedReducer = persistReducer(ReduxPersist.storeConfig, rootReducer)

// mount it on the Store
const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware)
)
// then run the saga
sagaMiddleware.run(rootSaga)

let persistor = persistStore(store)

export {
  store,
  persistor
}
