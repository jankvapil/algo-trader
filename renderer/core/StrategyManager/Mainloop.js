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
exports.run = (client, symbol, timeframe, tradeDelay, gindicators, strategies, updateTrades, updatePrice, updateState) => {

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

  // handles trade delay
  let wait = false

  /////
  ///// Main Loop
  /////
  const loop = setInterval(() => {
    //
    // Request for opened trades
    Orders.getOpenedTrades(client)
    //
    // Request for update symbol rates
    Orders.rates(client, symbol)

    const lastPrice = symbolArr[symbolArr.length - 1]
    
    console.log(openedTrades)

    // React GUI update
    updateTrades(openedTrades)

    if (!wait && lastPrice) {
      //
      // Update app state
      updatePrice(lastPrice.getPrice())
      //
      // Sends event to all strategies
      const state = strategyManager.sendEvent(openedTrades, symbolArr)

      //
      // Update state && fire delay
      if (state) {
        wait = true

        // React GUI update
        updateState(state.name)

        // After timeout enable trading
        setTimeout(() => { wait = false }, tradeDelay)
      }
    }
  }, timeframe)    

  return loop
}