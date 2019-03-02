const getCurrentPosition = (pair, balances) => {
  const parts = pair.split('/')
  if (balances[parts[0]].available >= 1 ) {
    return {
      amount: balances[parts[0]].available,
      unit: parts[0]
    }
  } else {
    return {
      amount: balances[parts[1]].available,
      unit: parts[1]
    }
  }
}

export {
  getCurrentPosition
}
