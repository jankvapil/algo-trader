// @ts-check

const Client = require("../MetaTrader/Client")
const Indicators = require("../Strategy/Indicators")
const Orders = require("../Strategy/Orders")
const SymbolValue = require("../../model/SymbolValue")


/**
 * Class contains algorithms for managing forex strategies
 */
class StrategyManager {
  /**
   *
   * @param {Client} client - MT Client
   * @param {Array<typeof import('../../model/Indicator')>} indicators
   * @param {Number} tradeDelay - set delay where is no new order send
   */
  constructor(client, indicators, tradeDelay) {
    this.client = client
    this.indicators = indicators
    this.tradeDelay = tradeDelay
    
    /** @type {Boolean} - indicates if waiting for trade execution */
    this.wait = false

    /** @type {Array} */
    this.strategies = []

    /** @type {Map<String, Number>} - represents name of indicator & value */
    this.indicatorValues = new Map()

    /** @type {Map<Number, Number>} - represents id of strategy & fitness */
    this.fitnessMap = new Map()

    /** @type {Map<Number, Number>} - represents id of strategy & number of opened positions */
    this.positionsMap = new Map()
  }

  //////////////////////////////////////////////////////////////////

  /**
   * Method adds strategy
   *
   * @param {Object} strat
   */
  addStrategy(strat) {

    // setStrat(id , defaultValue)
    this.positionsMap.set(strat.id, 0)
    this.fitnessMap.set(strat.id, 0)
    this.strategies.push(strat)
  }

  //////////////////////////////////////////////////////////////////

  // /**
  //  * @todo ..Tests if strategy should simulate trades or trade real
  //  *
  //  * @param {Number} strategyId
  //  */
  // isSimulated(strategyId) {
  //   return false
  // }

  //////////////////////////////////////////////////////////////////
  
  // /**
  //  *
  //  * @param {Array} openedTrades
  //  * @param {Number} id
  //  */
  // getTicketByStrategyId(openedTrades, id) {
  //   const keys = Object.keys(openedTrades)
  //   const target = 0.1

  //   // key == ticket (identificator of order)
  //   for (const key of keys) {
  //     const values = openedTrades[key]
  //     if (values.comment == id) {
  //       console.log(`${values.comment} = ${id}..?`)
  //       return {key: key, profit: values.pnl}
  //     }
  //   }
  //   return {key: 'init-state', profit: 0.0}
  // }

  //////////////////////////////////////////////////////////////////

  /**
   * Method gets event && sends it to all strategies
   *
   * @param {Array} openedTrades
   * @param {Array<SymbolValue>} db
   */
  sendEvent(openedTrades, db) {
    
    const lastPrice = db[db.length - 1].getPrice()
    
    console.log(this.indicators)

    //
    // Update indicators
    for (const i of this.indicators) {

      // console.log(i)
      //
      // If indicator requires more data, skip it
      if (i.timeframe > db.length) continue
      //
      // Cut part of db which indicator needs
      const part = db.slice(db.length - i.timeframe)
      //
      // Update indicator's value
      this.indicatorValues.set(i.name, i.f(part.map(sv => sv.getPrice())))
    }

    console.log(this.indicatorValues)

    // For each strategy create temporary Map of indicators and their current values used by the strategy
    this.strategies.forEach(s => {
      const tempMap = new Map()

      // console.log("indicators")
      // console.log(s.getIndicators().map(i => i.name))
      // console.log(s)


      for (const i of s.getIndicators().map(i => i.name)) {
        // console.log(i)

        const iVal = this.indicatorValues.get(i)
        // Continue to next strategy..
        if (!iVal) return
        tempMap.set(i, iVal)
      }

      // console.log(lastPrice)
      // console.log(tempMap)
      
      ///////////////////////////////////////////////////
      //// TODO: Decide if strategy should trade for real
      ///////////////////////////////////////////////////
      
      // Need to get strategy ticket 
      // const ticket = this.getTicketByStrategyId(openedTrades, s.id)
      // console.log(ticket)

      // const simulated = this.isSimulated(s.id)

      if (!this.wait) {
        const wasChanged = s.updateState(lastPrice, tempMap)

        if (wasChanged) {
          
          this.wait = true
          console.log(`WAS CHANGED: ${wasChanged} - Applying delay`)
  
          setTimeout(() => { this.wait = false }, this.tradeDelay); 
        }
      }
    })
  }
}

module.exports = StrategyManager
