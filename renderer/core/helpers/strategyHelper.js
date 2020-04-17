
///
/// Creates new strategy
///
exports.createStrategy = (indicators, client, symbol, strategy) => {

  const Strategy = require('../Strategy')
  const State = require('../State')
  const Orders = require('../Orders')

  const strat = new Strategy(
    strategy.id,
    [
      new State("INIT", () => {}),

      new State("SELL", () => {
          Orders.sell(
            client,
            strategy.id,
            symbol,
            strategy.lotSize,
            strategy.stopLoss,
            strategy.takeProfit
          )
      }),

      new State("BUY", () => {
          Orders.buy(
            client,
            strategy.id,
            symbol,
            strategy.lotSize,
            strategy.stopLoss,
            strategy.takeProfit
          )
      })
    ],
    0,
    indicators,
    10 // TODO: Change!!
  )

  console.log(`New strategy created.
    ID: ${ strategy.id }
    SL: ${ strategy.stopLoss }
    TP: ${ strategy.takeProfit }
    SELL: ${ strategy.sellPredicate }
    BUY: ${ strategy.buyPredicate } `)

  return strat
}

//////////////////////////////////////////////////////////

///
/// Defines strategy by SELL / BUY transitions
///
exports.defineStrategy = (strategy, sellPredicate, buyPredicate) => {
  strategy.setTransitions(
    eval(`(price, indicators) => `.concat(sellPredicate)),
    eval(`(price, indicators) => `.concat(buyPredicate))
  )   
}