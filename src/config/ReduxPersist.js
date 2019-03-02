import immutablePersistenceTransform from '../services/ImmutablePersistenceTransform'
import storage from 'redux-persist/lib/storage'

const ReduxPersist = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'root',
    storage,
    // Reducer keys that you do NOT want stored to persistence here.
    // blacklist: [],
    // Optionally, just specify the keys you DO want stored to persistence.
    whitelist: ['trader'],
    transforms: [immutablePersistenceTransform]
  }
}

export default ReduxPersist
