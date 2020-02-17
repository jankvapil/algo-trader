// @ts-check

/**
 * Class represents state of strategy
 */
class State {
  /**
   *
   * @param {String} name - unique state indentifier
   * @param {Function} transFun - transition function applied when state is changed
   */
  constructor(name, transFun) {
    this.name = name;
    this.transFun = transFun;
  }

  /**
   * Apply transition function
   * @param {number} ticket
   * @param {number} profit
   * @param {number} simulated
   */
  applyTransition(ticket, profit, simulated) {
    this.transFun(ticket, profit, simulated);
  }
}

module.exports = State;
