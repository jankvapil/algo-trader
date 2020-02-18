// @ts-check
const Client = require("./Client");
const Indicators = require("./Indicators");
const Orders = require("./Orders");
const State = require("./State");
const Strategy = require("./Strategy");
const SymbolValue = require("./SymbolValue");
const DB = require("./DB");

/**
 * Class contains algorithms for managing forex strategies
 */
class StrategyManager {
  /**
   *
   * @param {Client} client - MT Client
   * @param {Array<{name: String, timeframe: Number, f: Function}>} indicators
   */
  constructor(client, indicators) {
    this.client = client;
    this.indicators = indicators;

    /** @type {Array} */
    this.strategies = [];

    /** @type {Map<String, Number>} - represents name of indicator & value */
    this.indicatorValues = new Map();

    /** @type {Map<Number, Number>} - represents id of strategy & fitness */
    this.fitnessMap = new Map();

    /** @type {Map<Number, Number>} - represents id of strategy & number of opened positions */
    this.positionsMap = new Map();
  }

  //////////////////////////////////////////////////////////////////

  /**
   * Method creates a new Strategy
   *
   * @param {Number} strategyId
   * @param {String} symbol
   * @param {Array<String>} indicators
   */
  addStrategy(strategyId, symbol, indicators) {
    //
    // Check if indicator is subscribed
    indicators.forEach(i => {
      const res = this.indicators.find(i2 => i2.name == i);
      if (!res) throw new Error("Undefined Indicator!");
    });

    this.positionsMap.set(strategyId, 0);
    this.fitnessMap.set(strategyId, 0);

    // Creates new strategy
    this.strategies.push(
      new Strategy(
        strategyId,
        [
          new State("INIT", () => {}),

          new State("SELL", (ticket, profit, simulated) => {
            if (!simulated)
              Orders.sell(this.client, strategyId, symbol);
          }),

          new State("BUY", (ticket, profit, simulated) => {
            if (!simulated)
              Orders.buy(this.client, strategyId, symbol);
          }),

          new State("CLOSE", (ticket, profit, simulated) => {
            if (simulated) {
              // TODO: Save fitness to db as simulated
            } else {
              // TODO: Save fitness to db as real
              Orders.closeOrder(this.client, ticket);
            }
          })
        ],
        0,
        indicators,
        0.10
      )
    );
  }

  //////////////////////////////////////////////////////////////////

  /**
   * @todo ..Tests if strategy should simulate trades or trade real
   *
   * @param {Number} strategyId
   */
  isSimulated(strategyId) {
    return false;
  }

  //////////////////////////////////////////////////////////////////
  
  /**
   *
   * @param {Array} openedTrades
   * @param {Number} id
   */
  getTicketByStrategyId(openedTrades, id) {
    const keys = Object.keys(openedTrades);
    const target = 0.1;

    // key == ticket (identificator of order)
    for (const key of keys) {
      const values = openedTrades[key];
      if (values.comment == id) return {key: key, profit: values.pnl}
    }
    return {key: 'init-state', profit: 0.0}
  }

  //////////////////////////////////////////////////////////////////

  /**
   * Method gets event && sends it to all strategies
   *
   * @param {Array} openedTrades
   * @param {Array<SymbolValue>} db
   */
  sendEvent(openedTrades, db) {
    //
    ////// TODO: close positions ////////
    
    const lastPrice = db[db.length - 1].getPrice();
    // this.closePositions(openedTrades, lastPrice);

    //
    // Update indicators
    for (const i of this.indicators) {
      //
      // If indicator requires more data, skip it
      if (i.timeframe > db.length) continue;
      //
      // Cut part of db which indicator needs
      const part = db.slice(db.length - i.timeframe);
      //
      // Update indicator's value
      this.indicatorValues.set(i.name, i.f(part.map(sv => sv.getPrice())));
    }

    // console.log(this.indicatorValues);

    // For each strategy create temporary Map of indicators and their current values used by the strategy
    this.strategies.forEach(s => {
      const tempMap = new Map();

      for (const i of s.getIndicators()) {
        const iVal = this.indicatorValues.get(i);
        // Continue to next strategy..
        if (!iVal) return;
        tempMap.set(i, iVal);
      }

      ///////////////////////////////////////////////////
      //// TODO: Decide if strategy should trade for real
      ///////////////////////////////////////////////////
      
      // Need to get strategy ticket 
      const ticket = this.getTicketByStrategyId(openedTrades, s.id);
      console.log(ticket);

      const simulated = this.isSimulated(s.id);

      s.updateState(ticket.key, lastPrice, ticket.profit, tempMap, simulated);
    });
  }
}

module.exports = StrategyManager;
