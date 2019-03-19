const getCurrentPosition = (pair, balances) => {
  const parts = pair.split('/')
  let currentBalance = {}
  if (balances[parts[0]].available >= 1 ) {
    currentBalance = {
      amount: balances[parts[0]].available,
      unit: parts[0],
      pair: {}
    }
  } else {
    currentBalance = {
      amount: balances[parts[1]].available,
      unit: parts[1],
      pair: {}
    }
  }

  currentBalance.pair[parts[0]] = balances[parts[0]]
  currentBalance.pair[parts[1]] = balances[parts[1]]

  return currentBalance
}

export {
  getCurrentPosition
}
