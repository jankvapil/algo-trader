// @ts-check

/**
 * Class represents bid/ask and average value of forex symbol
 */
class SymbolValue {
  /**
   *
   * @param {number} bid
   * @param {number} ask
   */
  constructor(bid, ask) {
    this.bid = bid;
    this.ask = ask;
  }

  /**
   * @returns {number} - symbol's value
   */
  getPrice() {
    return Math.round(((this.bid + this.ask) / 2.0) * 100000) / 100000;
  }
}

module.exports = SymbolValue;
