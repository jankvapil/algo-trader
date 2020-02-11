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
    // Check indicator if is subscribed
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

          new State("SELL", price => {
            this.openPosition("SELL", strategyId, symbol, price);
          }),

          new State("BUY", price => {
            this.openPosition("BUY", strategyId, symbol, price);
          })
        ],
        0,
        indicators
      )
    );
  }

  //////////////////////////////////////////////////////////////////

  /**
   * Handles open position request
   *
   * @param {String} op - operation BUY or SELL
   * @param {Number} strategyId
   * @param {String} symbol
   * @param {Number} price
   */
  openPosition(op, strategyId, symbol, price) {
    const numOfPos = this.positionsMap.get(strategyId);
    const active = this.isActive(strategyId);

    if (numOfPos < 3) {
      this.positionsMap.set(strategyId, numOfPos + 1);
      // console.log(`${strategyId} has ${numOfPos} opened positions.`);

      // Save both simulated and real orders?
      if (active && op == "SELL") Orders.sell(this.client, strategyId, symbol);
      if (active && op == "BUY") Orders.buy(this.client, strategyId, symbol);
    }
  }

  /**
   * @todo ..Tests if strategy should simulate trades or trade real
   *
   * @param {Number} strategyId
   */
  isActive(strategyId) {
    return true;
  }

  //////////////////////////////////////////////////////////////////

  /**
   * Function loops through the opened trades and decides which trades are ready to close
   *
   * @param {Array} openedTrades
   * @param {Number} price
   */
  closePositions(openedTrades, price) {
    const keys = Object.keys(openedTrades);
    const target = 0.1;

    for (const key of keys) {
      // key == ticket (identificator of order)
      console.log(key);
      const values = openedTrades[key];
      console.log(values);

      // values.comment == identificator of strategy in MetaTrader
      const strat = this.strategies.find(s => s.id == values.comment);
      if (strat) {
        const stratId = Number(values.comment);
        const totalProfit = this.fitnessMap.get(stratId);
        const profitMinusCommission = values.pnl - 0.07;

        if (profitMinusCommission < -target || profitMinusCommission > target) {
          console.log("CLOSING POSITION");

          // This could be dealayed.. it can send closeOrder multiple times (and count fitness)
          Orders.closeOrder(this.client, key);
          this.fitnessMap.set(stratId, totalProfit + profitMinusCommission);
        }
      }

      console.log("Fitness:");
      console.log(this.fitnessMap);
    }
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
    this.closePositions(openedTrades, lastPrice);

    //
    // Updates indicators
    for (const i of this.indicators) {
      //
      // If indicator requires more data, skip it
      if (i.timeframe > db.length) continue;
      //
      // Cuts part of db which indicator needs
      const part = db.slice(db.length - i.timeframe);
      //
      // Update indicator's value
      this.indicatorValues.set(i.name, i.f(part.map(sv => sv.getPrice())));
    }

    // console.log(this.indicatorValues);

    // For each strategy creates temporary Map of indicators and their current values used by the strategy
    this.strategies.forEach(s => {
      const tempMap = new Map();

      for (const i of s.getIndicators()) {
        const iVal = this.indicatorValues.get(i);
        // Continue to next strategy..
        if (!iVal) return;
        tempMap.set(i, iVal);
      }

      s.updateState(lastPrice, tempMap);
    });
  }
}

module.exports = StrategyManager;
