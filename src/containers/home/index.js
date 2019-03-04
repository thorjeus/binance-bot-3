import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import { connect } from 'react-redux'

import LeftCol from './leftCol'
import './style.css';

// const binance = require('node-binance-api')().options({
//   APIKEY: process.env.REACT_APP_BINANCE_API_KEY,
//   APISECRET: process.env.REACT_APP_BINANCE_API_SECRET,
//   useServerTime: true // If you get timestamp errors, synchronize to server time at startup
// })

class Home extends Component {
  componentDidMount () {
    // binance.websockets.chart("ADAUSDT", "5m", (symbol, interval, chart) => {
    //   if (chart) {
    //     let tick = binance.last(chart);
    //     const last = chart[tick].close;
    //     // console.log(chart);
    //     console.log(tick)
    //     // Optionally convert 'chart' object to array:
    //     // let ohlc = binance.ohlc(chart);
    //     // console.log(symbol, ohlc);
    //     console.log(symbol+" last price: "+last)
    //   } else {
    //     console.log('no chart...')
    //   }
    // }, (err) => {
    //   console.log('error: ',err)
    // });
    // try  {
    //   // const mySocket = new WebSocket(`wss://stream.binance.com:9443/ws/adausdt@kline_5m`)
    //   // mySocket.onmessage((data) => {
    //   //   console.log('ws: ',data)
    //   // });
    //   this.socket = new WebSocket(`wss://stream.binance.com:9443/ws/adausdt@kline_5m`);
    //   // this.socket.onopen = this.onOpen.bind(this);
    //   // this.socket.onclose = this.onClose.bind(this);
    //   // this.socket.onerror = this.onError.bind(this);
    //   this.socket.onmessage = (message) => { console.log('onmessage: ', message) }
    //
    // } catch (err) {
    //   console.log('ws error: ',err)
    // }
  }

  renderRightCol = () => {
    return <Col className="right-col" />
  }

  render() {
    return (
      <Container fluid>
        <Row noGutters>
          <LeftCol />
          {this.renderRightCol()}
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
