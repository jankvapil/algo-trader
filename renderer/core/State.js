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
    this.name = name
    this.transFun = transFun
  }

  /**
   * Apply transition function
   */
  applyTransition() {
    this.transFun()
  }
}

module.exports = State