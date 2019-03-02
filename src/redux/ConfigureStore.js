import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'

import rootReducer from './reducers'
import { ReduxPersist } from '../config'

const persistedReducer = persistReducer(ReduxPersist.storeConfig, rootReducer)

let store = createStore(persistedReducer)
let persistor = persistStore(store)

export {
  store,
  persistor
}
