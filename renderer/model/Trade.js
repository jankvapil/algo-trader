// ticket:
// magic: 123456
// symbol: "EURUSD"
// lots: 0.01
// type: 1
// openprice: 1.08175
// opentime: "2020.04.22 21:48:07"
// SL: 1.08185
// TP: 1.08165
// pnl: -0.06
// comment: "my-strategy"

// @ts-check

/**
 * Class represents indicator
 */
class Trade {
  /**
   *
   * @param {number} ticket Brooker's ticket id
   * @param {number} magic MetaTrader's Expert-Advisor id
   * @param {string} symbol Traded instrument
   * @param {number} lots Number of lots
   * @param {string} type BUY or SELL
   * @param {number} openprice
   * @param {string} opentime
   * @param {number} SL
   * @param {number} TP
   * @param {number} pnl profit in pips
   * @param {string} comment indentifier of strategy
   */
  constructor(ticket, magic, symbol, lots, type, openprice, opentime, SL, TP, pnl, comment) {
    this.ticket = ticket
    this.magic = magic
    this.symbol = symbol
    this.lots = lots
    this.type = type
    this.openprice = openprice
    this.opentime = opentime
    this.SL = SL
    this.TP = TP
    this.pnl = pnl
    this.comment = comment
  }
}

module.exports = Trade
