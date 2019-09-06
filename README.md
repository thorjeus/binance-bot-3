My personal crypto trading bot that is suitable for scalping 1min or 5min candlestick timeframe that is still on active development. The app calculates the RSI out from the candlestick data from the Binance websocket API. It then enters into a position base on the set RSI buy trigger and then set a sell order base on the calculated value to either take a profit or to stop from a certain loss depending on the price direction.

# Libraries
* Wrapped with [Electron](https://electronjs.org/) for it to be deployed as a desktop application.
* Built with [React](https://reactjs.org/) and was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
* Used [React Bootstrap](https://react-bootstrap.github.io/) for its front-end UI framework.
* Utilized (Redux)[https://redux.js.org/] as the its state container.

# Local Installation
**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Add dependencies by running `yarn` or `npm i` on CLI

# Running Locally
**Step 1:** cd to the cloned repo:

**Step 2:** Build by running `npm run build`

**Step 3:** Launch as a desktop application by running `npm run electron`
