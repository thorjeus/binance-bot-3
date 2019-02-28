import React, { Component } from 'react'
import { Container, Row, Col, Form, Button, Card, InputGroup, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import axios from 'axios'

import './style.css';

// const binance = require('node-binance-api')().options({
//   APIKEY: process.env.REACT_APP_BINANCE_API_KEY,
//   APISECRET: process.env.REACT_APP_BINANCE_API_SECRET,
//   useServerTime: true // If you get timestamp errors, synchronize to server time at startup
// })

class Home extends Component {

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

  renderLeftCol = () => {
    return (
      <Col className="left-col">
        <Card className="card">
          <Card.Header>
            <h2 className="header-label"><strong className="header-value">30</strong> RSI</h2>
          </Card.Header>
          <Card.Body>
            <Form className="form text-center">

              <Form.Group className="text-center">
                <Form.Label className="label">Amount</Form.Label>
                <InputGroup>
                  <FormControl type="number" defaultValue={0} />
                  <InputGroup.Append>
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>

              <Form.Group className="text-center">
                <Form.Label className="label">Pair</Form.Label>
                <Form.Control as="select" className="select-field">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </Form.Control>
              </Form.Group>

            </Form>
          </Card.Body>
          <Card.Body>
            <div className="text-center">
              <Button variant="success" size="lg">
                <FontAwesomeIcon icon="play" /> Start
              </Button>
            </div>
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

export default Home;
