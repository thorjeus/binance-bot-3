import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import Header from './components/header'

import Home from './containers/home'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
library.add(faPlay, faStop)

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header />

          <Route exact path="/" component={Home} />
        </div>
      </Router>
    )
  }
}

export default App;
