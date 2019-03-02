import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/ConfigureStore'

import Header from './components/header'

import Home from './containers/home'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faStop, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
library.add(faPlay, faStop, faArrowUp, faArrowDown)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <div>
              <Header />

              <Route exact path="/" component={Home} />
            </div>
          </Router>
        </PersistGate>
      </Provider>
    )
  }
}

export default App;
