// @ts-check

const Client = require("../MetaTrader/Client")
const StrategyManager = require("../../core/StrategyManager/StrategyManager")
const Orders = require("../../core/Strategy/Orders")

const IndicatorsHelper = require('../../core/helpers/indicatorsHelper')

  /**
   * Creates Main Program Loop
   *
   * @param {Client} client
   * @param {String} symbol
   * @param {Number} timeframe
   * @param {Number} tradeDelay
   * @param {Array} gindicators 
   * @param {Array} strategies
   * @param {Function} updateTrades
   * @param {Function} updatePrice
   */
exports.run = (client, symbol, timeframe, tradeDelay, gindicators, strategies, updateTrades, updatePrice) => {

  // Indicators needs to be initialized
  const indicators = IndicatorsHelper.initIndicators(gindicators)
  
  // Create strategy manager who handles incomming events
  const strategyManager = new StrategyManager(client, indicators, tradeDelay)

  // Set monitoring symbol & get reference on the array
  const symbolArr = client.setSymbolMonitoring(symbol)

  // Pass strategies to strategy manager
  strategies.forEach(s => { strategyManager.addStrategy(s) })

  // Set monitored symbol's array length (don't need longer array than max timeframe)
  const maxTimeframe = Math.max(... indicators.map(i => i.timeframe))

  client.setDbMaxLength(maxTimeframe)    

  const openedTrades = client.getOpenedTrades()

  const loop = setInterval(() => {
    //
    // Request for opened trades
    Orders.getOpenedTrades(client)
    //
    // Request for update symbol rates
    Orders.rates(client, symbol)

    const lastPrice = symbolArr[symbolArr.length - 1]
    
    console.log(openedTrades)

    // React update
    updateTrades(openedTrades)

    if (lastPrice) {
      //
      // Sends event to all strategies
      strategyManager.sendEvent(openedTrades, symbolArr)
      //
      // Update app state
      updatePrice(lastPrice.getPrice())
    }
  }, timeframe)    

  return loop
}