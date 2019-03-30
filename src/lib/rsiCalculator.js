import { TradeConfig } from '../config'

const getPriceDifference = (recent, last) => {
  let change = recent.closingPrice - last.closingPrice
  recent.change = change
  recent.loss = 0
  recent.gain = 0

  if (recent.closingPrice > last.closingPrice) {
    recent.gain = recent.closingPrice - last.closingPrice
  } else {
    recent.loss = last.closingPrice - recent.closingPrice
  }
  return recent
}

const getPriceMovementDirection = change => {
  let movement = ''
  if (change < 0) movement = 'down'
  else if (change > 0) movement = 'up'
  return movement
}

const getAvgGain = (recent, last, periods) => {
  let avgGain
  if (!last.avgGain) {
    let totalGain = 0
    periods.forEach(item => {
      totalGain += item.gain
    })
    totalGain += recent.gain
    avgGain = totalGain / TradeConfig.chartPeriod
  } else {
    // avgGain = (last.avgGain * (periods.length - 1) + recent.gain) / periods.length

    const k = 2 / (TradeConfig.chartPeriod + 1)
    avgGain = recent.gain * k + last.avgGain * (1 - k)
  }

  return avgGain
}

const getAvgLoss = (recent, last, periods) => {
  let avgLoss
  if (!last.avgLoss) {
    let totalLoss = 0
    periods.forEach(item => {
      totalLoss += item.loss
    })
    totalLoss += recent.loss
    avgLoss = totalLoss / TradeConfig.chartPeriod
  } else {
    // avgLoss = (last.avgLoss * (periods.length - 1) + recent.loss) / periods.length

    const k = 2 / (TradeConfig.chartPeriod + 1)
    avgLoss = recent.loss * k + last.avgLoss * (1 - k)
  }

  return avgLoss
}

const parsePeriod = (recentPeriod, parsedPeriods, emaLength) => {
  let pending = {
    symbol: recentPeriod.s,
    eventTime: recentPeriod.E,
    closingPrice: parseFloat(recentPeriod.k.c),
    priceMovement: ''
  }

  // first period, just return the closing price
  if (parsedPeriods.length === 0) {
    parsedPeriods.push(pending)
    return parsedPeriods
  }

  const lastPeriod = parsedPeriods[parsedPeriods.length - 1]
  // gather price change, gain, loss against previous period
  pending = getPriceDifference(pending, lastPeriod)
  pending.priceMovement = getPriceMovementDirection(pending.change)

  // remove first saved period that does not contain a calculated change yet
  if (parsedPeriods.length === 1 && typeof lastPeriod.change === 'undefined') {
    parsedPeriods.shift()
    parsedPeriods.push(pending)
    return parsedPeriods
  }

  if (parsedPeriods.length < TradeConfig.chartPeriod) {
    parsedPeriods.push(pending)
    return parsedPeriods
  }

  pending.avgGain = getAvgGain(pending, lastPeriod, parsedPeriods)
  pending.avgLoss = getAvgLoss(pending, lastPeriod, parsedPeriods)
  if (lastPeriod.avgGain && lastPeriod.avgLoss) {
    pending.rs = pending.avgGain / pending.avgLoss
  }

  if (TradeConfig.requiredEMAperiod <= (emaLength + 1)) {
    let rsi = 100 - (100 / (1 + pending.rs))
    pending.rsi = parseFloat(rsi.toFixed(4))
  }

  parsedPeriods.shift()
  parsedPeriods.push(pending)

  return parsedPeriods
}

export {
  parsePeriod
}
