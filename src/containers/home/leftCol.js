import React, { Component } from 'react'
import { Row, Col, Form, Button, Card, InputGroup, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TradeConfig } from '../../config'

import { connect } from 'react-redux'
import TraderAction from '../../redux/TraderRedux'
import BalanceAction from '../../redux/BalanceRedux'
import WebsocketAction from '../../redux/WebsocketRedux'

import usdtPairs from '../../fixtures/usdtPairs'
import BinanceApi from '../../services/NodeBinanceApi'

import './style.css';

class LeftCol extends Component {
  constructor (props) {
    super(props)

    this.state = {
      takeProfitRatio: this.props.takeProfitRatio,
      stopLossRatio: this.props.stopLossRatio,
      positionSize: 10,
      buyTrigger: 10,
      pair: '',
      balance: '',
      balanceUnit: ''
    }
  }

  componentDidMount () {
    this.onOfflineListener = window.addEventListener('offline', () => {
      console.log('came offline!!!')
    })
    console.log('this.props.buyData: ', this.props.buyData)
  }

  componentWillUnmount () {
    window.removeEventListener('offline', this.onOfflineListener)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.takeProfitRatio !== this.state.takeProfitRatio || prevState.stopLossRatio !== this.state.stopLossRatio) {
      this.props.setProfitLossRatio(this.state.takeProfitRatio, this.state.stopLossRatio)
    }

    const { periods, recentPeriod, balance, buyData, periodCount, takeProfitPrice, stopLossPrice, started } = this.props
    const neededPeriods = TradeConfig.chartPeriod * 2

    if (
      this.props.recentPeriod && this.props.recentPeriod.eventTime && prevProps.recentPeriod && prevProps.recentPeriod.eventTime &&
      this.props.recentPeriod.eventTime !== prevProps.recentPeriod.eventTime && started
    ) {
      // console.log('recentPeriod: ',recentPeriod)
      if (!buyData) {
        // no buy data indicates an action is still to buy
        // console.log('recentPeriod.rsi, this.state.buyTrigger, periodCount, neededPeriods: ',recentPeriod.rsi, this.state.buyTrigger, periodCount, neededPeriods)
        if (
          recentPeriod && recentPeriod.rsi && recentPeriod.rsi <= this.state.buyTrigger &&
          periodCount >= neededPeriods
        ) {
          console.log('Enter buy zone(rsi): ', recentPeriod.rsi)
          this._placeBuyOrder()
        }
      } else {
        // with buy data already stored, indicates an action to sell
        if (takeProfitPrice && stopLossPrice && recentPeriod.closingPrice) {
          console.log('takeProfitPrice <= recentPeriod.closingPrice || stopLossPrice >= recentPeriod.closingPrice: ',takeProfitPrice <= recentPeriod.closingPrice, stopLossPrice >= recentPeriod.closingPrice)
          if (takeProfitPrice <= recentPeriod.closingPrice || stopLossPrice >= recentPeriod.closingPrice) {
            this._placeSellOrder()
          }
        }

      }
    }

    if (prevProps.ordering && !this.props.ordering) {
      if (this.props.buyError) {
        console.log('Buy Order Failed: ', this.props.buyError)
      }
    }
  }

  _placeBuyOrder = async () => {
    const { balance } = this.props
    const symbol = this.state.pair.replace('/', '')
    const baseSymbol = this.state.pair.split('/')[1]

    // cancel any pending order with regards the choosen pair
    const cancelResp = await BinanceApi.cancelOrders(symbol)
    console.log('cancel call before buy: ', cancelResp)

    // check if we have sufficient balance to place an order
    // if (balance && balance.pair && balance.pair[baseSymbol] && parseInt(balance.pair[baseSymbol].available) > 2) {
      const priceResp = await BinanceApi.getPriceBySymbol(symbol)
      const capital = parseFloat(balance.pair[baseSymbol].available) * (parseInt(this.state.positionSize) * .01)
      const price = parseFloat(priceResp.data[symbol])
      const quantity = Math.floor(capital / price)

      console.log('this.props.placeBuyOrder(symbol, quantity, price): ', symbol, quantity, price)
      this.props.placeBuyOrder(symbol, quantity, price)
    // }
  }

  _placeSellOrder = async () => {
    const symbol = this.state.pair.replace('/', '')
    const { buyData, recentPeriod } = this.props

    // cancel any pending order with regards the choosen pair
    const cancelResp = await BinanceApi.cancelOrders(symbol)
    console.log('cancel call before sell: ', cancelResp)

    console.log('this.props.placeSellOrder(symbol, buyData.origQty, recentPeriod.closingPrice)', symbol, buyData.origQty, recentPeriod.closingPrice)
    this.props.placeSellOrder(symbol, buyData.origQty, recentPeriod.closingPrice)
  }

  checkForm = () => {
    const {pair, positionSize, buyTrigger, takeProfitRatio, stopLossRatio} = this.state
    let disabled = true
    if (pair !== '' && positionSize > 0 && buyTrigger > 0 && takeProfitRatio > 0 && stopLossRatio > 0) {
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

  onValueChange = (event, stateKey) => {
    let value = 0
    if (event.target.value <= 100 && event.target.value >= 0 && !isNaN(event.target.value)) {
      value = parseInt(event.target.value)
    }
    let newState = {}
    newState[stateKey] = value
    this.setState(newState)
  }

  displayCurrentPosition = () => {
    const {balance} = this.props
    if (!balance || (balance && !balance.amount)) return <div />

    // console.log('balance: ', balance)

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
          Price <strong className="header-value">{recentPeriod.closingPrice}</strong>{' '}
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
        <h2 className="header-label">RSI <strong className="header-value">{Math.round(recentPeriod.rsi)}</strong></h2>
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
                    <Form.Label className="label">Profit Ratio</Form.Label>
                    <InputGroup>
                      <FormControl
                        disabled={started}
                        value={this.state.takeProfitRatio}
                        onChange={(ev) => this.setState({ takeProfitRatio: isNaN(parseFloat(ev.target.value)) ? '' : parseFloat(ev.target.value) })}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col className="ml-2">
                <Form.Group>
                  <Form.Label className="label">Loss Ratio</Form.Label>
                    <InputGroup>
                      <FormControl
                        disabled={started}
                        value={this.state.stopLossRatio}
                        onChange={(ev) => this.setState({ stopLossRatio: isNaN(parseFloat(ev.target.value)) ? '' : parseFloat(ev.target.value) })}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>


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
              disabled={this.checkForm() && !started}
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
    ordering: state.trader.ordering,
    buyData: state.trader.buyData,
    buyError: state.trader.buyError,
    takeProfitRatio: state.trader.takeProfitRatio,

    takeProfitPrice: state.trader.takeProfitPrice,
    stopLossPrice: state.trader.stopLossPrice,

    stopLossRatio: state.trader.stopLossRatio,
    fetching: state.balance.fetching,
    balance: state.balance.balance,
    balanceError: state.balance.error,
    fetchingChart: state.websocket.fetchingChart,
    recentPeriod: state.websocket.recentPeriod,
    periodCount: state.websocket.periodCount,
    chartError: state.websocket.chartError,
    periods: state.websocket.periods
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleTrader: () => dispatch(TraderAction.toggleTrader()),
    placeBuyOrder: (symbol, quantity, price, param) => dispatch(TraderAction.placeBuyOrder(symbol, quantity, price, param)),
    placeSellOrder: (symbol, quantity, price, param) => dispatch(TraderAction.placeSellOrder(symbol, quantity, price, param)),
    setProfitLossRatio: (profit, loss) => dispatch(TraderAction.setProfitLossRatio(profit, loss)),
    getBalance: pair => dispatch(BalanceAction.getBalance(pair)),
    getChart: (pair, timeframe) => dispatch(WebsocketAction.getChart(pair, timeframe)),
    resetChartData: () => dispatch(WebsocketAction.resetChartData())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftCol)

/*
clientOrderId: "web_516946efbeaa4a6899b54e2e856d17e2"
cummulativeQuoteQty: "0.00000000"
executedQty: "0.00000000"
icebergQty: "0.00000000"
isWorking: false
orderId: 94053865
origQty: "4.91000000"
price: "14.54590000"
side: "SELL"
status: "NEW"
stopPrice: "14.54600000"
symbol: "BNBUSDT"
time: 1552719512989
timeInForce: "GTC"
type: "STOP_LOSS_LIMIT"
updateTime: 1552719512989
*/
