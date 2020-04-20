// @ts-check

/**
 * Class represents indicator
 */
class Indicator {
  /**
   *
   * @param {string} name
   * @param {number} timeframe
   * @param {string} type
   * @param {function} f
   */
  constructor(name, timeframe, type, f) {
    this.name = name
    this.timeframe = timeframe
    this.type = type
    this.f = f
  }
}

module.exports = Indicator
