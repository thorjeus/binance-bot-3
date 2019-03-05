import React, { Component } from 'react'
import { Row, Col, Form, Button, Card, InputGroup, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TradeConfig } from '../../config'

import { connect } from 'react-redux'
import TraderAction from '../../redux/TraderRedux'
import BalanceAction from '../../redux/BalanceRedux'
import WebsocketAction from '../../redux/WebsocketRedux'

import usdtPairs from '../../fixtures/usdtPairs'

import './style.css';

class LeftCol extends Component {
  constructor (props) {
    super(props)

    this.state = {
      positionSize: 0,
      buyTrigger: 20,
      pair: '',
      balance: '',
      balanceUnit: ''
    }
  }

  componentDidMount () {

  }

  componentDidUpdate (prevProps, prevState) {
    // if (prevProps.fetchingChart && !this.props.fetchingChart && this.props.chartData.currentPrice) {
    //   console.log('currentPrice: ', this.props.chartData.currentPrice)
    // }
  }

  onValueChange = (event, stateKey) => {
    let value = 0
    if (event.target.value <= 100 && event.target.value >= 0 && !isNaN(event.target.value)) {
      value = parseInt(event.target.value)
    }
    let newState = {}
    newState[stateKey] = value
    this.setState(newState)
  }

  checkForm = () => {
    const {pair, positionSize, buyTrigger} = this.state
    let disabled = true
    if (pair !== '' && positionSize > 0 && buyTrigger > 0) {
      disabled = false
    }
    return disabled
  }

  onPairChange = event => {
    const { value } = event.target
    this.props.getBalance(value)
    this.props.resetChartData()
    this.props.getChart(value.replace('/', ''), TradeConfig.timeframe)
    this.setState({pair: value})
  }

  displayCurrentPosition = () => {
    const {balance} = this.props
    if (!balance || (balance && !balance.amount)) return <div />

    return (
      <h2 className="header-label">Position <strong className="header-value">{balance.unit}</strong></h2>
    )
  }

  displayCurrentPrice = () => {
    const {recentPeriod} = this.props
    // console.log(recentPeriod)

    if (recentPeriod && recentPeriod.closingPrice) {
      return (
        <h2 className="header-label">
          <strong className="header-value">{recentPeriod.closingPrice}</strong>{' '}
          {recentPeriod.priceMovement === 'up' && <FontAwesomeIcon icon="arrow-up" style={{color: 'green'}} />}
          {recentPeriod.priceMovement === 'down' && <FontAwesomeIcon icon="arrow-down" style={{color: 'red'}} />}
        </h2>
      )
    } else {
      return <div style={{minHeight: '21px'}} />
    }
  }

  displayCurrentRSI = () => {
    const {recentPeriod} = this.props
    if (recentPeriod && recentPeriod.rsi) {
      return (
        <h2 className="header-label"><strong className="header-value">{recentPeriod.rsi.toFixed(0)}</strong> RSI</h2>
      )
    }
    return <div />
  }

  render () {
    const { started } = this.props

    return (
      <Col className="left-col">
        <Card className="card">
          <Card.Header className="card-header">
            {this.displayCurrentRSI()}
            {this.displayCurrentPrice()}
          </Card.Header>
          <Card.Body>
            <Form className="form text-center">

              <Row noGutters>
                <Col className="mr-2">
                  <Form.Group>
                    <Form.Label className="label">Position Size</Form.Label>
                    <InputGroup>
                      <FormControl
                        disabled={started}
                        type="number"
                        value={this.state.positionSize}
                        onChange={(ev) => this.onValueChange(ev, 'positionSize')}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col className="ml-2">
                <Form.Group>
                  <Form.Label className="label">Buy Trigger</Form.Label>
                    <InputGroup>
                      <FormControl
                        disabled={started}
                        type="number"
                        value={this.state.buyTrigger}
                        onChange={(ev) => this.onValueChange(ev, 'buyTrigger')}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text>RSI</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label className="label">Pair</Form.Label>
                <Form.Control
                  disabled={started}
                  as="select"
                  className="select-field"
                  value={this.state.pair}
                  onChange={this.onPairChange}
                >
                  <option></option>
                  {usdtPairs.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Form.Control>
              </Form.Group>

            </Form>
          </Card.Body>
          <Card.Body className="card-footer">
            {this.displayCurrentPosition()}
            <Button
              disabled={this.checkForm()}
              className="start-button"
              variant={started ? 'danger' : 'success'}
              size="lg"
              onClick={() => { this.props.toggleTrader() }}
            >
              <FontAwesomeIcon icon={started ? 'stop' : 'play'} />{' '}
              {started ? 'Stop' : 'Start'}
            </Button>
          </Card.Body>
        </Card>
      </Col>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.trader.started,
    fetching: state.balance.fetching,
    balance: state.balance.balance,
    balanceError: state.balance.error,
    fetchingChart: state.websocket.fetchingChart,
    recentPeriod: state.websocket.recentPeriod,
    chartError: state.websocket.chartError,
    periods: state.websocket.periods
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleTrader: () => dispatch(TraderAction.toggleTrader()),
    getBalance: pair => dispatch(BalanceAction.getBalance(pair)),
    getChart: (pair, timeframe) => dispatch(WebsocketAction.getChart(pair, timeframe)),
    resetChartData: () => dispatch(WebsocketAction.resetChartData())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftCol)
