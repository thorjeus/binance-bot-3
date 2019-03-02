import React, { Component } from 'react'
import { Container, Row, Col, Form, Button, Card, InputGroup, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { AppConfig } from '../../config'

import { connect } from 'react-redux'
import TraderAction from '../../redux/TraderRedux'

import './style.css';

// const binance = require('node-binance-api')().options({
//   APIKEY: process.env.REACT_APP_BINANCE_API_KEY,
//   APISECRET: process.env.REACT_APP_BINANCE_API_SECRET,
//   useServerTime: true // If you get timestamp errors, synchronize to server time at startup
// })

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      positionSize: 0,
      pair: ''
    }
  }

  componentDidMount () {
    // binance.prices('BNBBTC', (error, ticker) => {
    //   if (error) {
    //     console.log("Error: ", error);
    //   } else {
    //     console.log("Price of BNB: ", ticker);
    //   }
    // })

    // axios.get(process.env.REACT_APP_BINANCE_API_URL + 'api/v1/exchangeInfo').then(resp => {
    //   console.log('resp: ',resp)
    // })
  }

  onAmountSizeChange = event => {
    let positionSize = 0
    if (event.target.value <= 100 && event.target.value >= 0 && !isNaN(event.target.value)) {
      positionSize = event.target.value
    }
    this.setState({positionSize})
  }

  renderLeftCol = () => {
    const { started } = this.props

    return (
      <Col className="left-col">
        <Card className="card">
          <Card.Header className="card-header">
            <h2 className="header-label"><strong className="header-value">30</strong> RSI</h2>
            <h2 className="header-label">
              <strong className="header-value">0.0007304</strong>{' '}
              <FontAwesomeIcon icon="arrow-up" style={{color: 'green'}} />
            </h2>
          </Card.Header>
          <Card.Body>
            <Form className="form text-center">

              <Form.Group>
                <Form.Label className="label">Position Size</Form.Label>
                <InputGroup>
                  <FormControl
                    type="number"
                    value={this.state.positionSize}
                    onChange={this.onAmountSizeChange}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Form.Label className="label">Pair</Form.Label>
                <Form.Control as="select" className="select-field">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </Form.Control>
              </Form.Group>

            </Form>
          </Card.Body>
          <Card.Body className="card-footer">
            <h2 className="header-label"><strong className="header-value">71.4356</strong> USDT</h2>
            <Button
              className="start-button"
              variant={started ? 'danger' : 'success'}
              size="lg"
            >
              <FontAwesomeIcon icon={started ? 'stop' : 'play'} /> Start
            </Button>
          </Card.Body>
        </Card>
      </Col>
    )
  }

  renderRightCol = () => {
    return (
      <Col className="right-col">

      </Col>
    )
  }

  render() {
    console.log('this.props.started = ',this.props.started)
    return (
      <Container fluid>
        <Row noGutters>
          {this.renderLeftCol()}
          {this.renderRightCol()}
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.trader.started
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleTrader: () => dispatch(TraderAction.toggleTrader())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
