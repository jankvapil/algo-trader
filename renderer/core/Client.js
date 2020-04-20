// @ts-check

const zmq = require("zeromq");
const SymbolValue = require("../model/SymbolValue")

/**
 * Class represents a MetaTrader Client.
 * Client connects to MT4 Expert Advisor server via ZMQ socket.
 */
class Client {
  /**
   *
   * @param {Number} reqPort
   * @param {Number} pullPort
   */
  constructor(reqPort, pullPort) {
    this.reqPort = reqPort;
    this.pullPort = pullPort;

    /** @type {Object} */
    this.reqSocket = zmq.socket("req");

    /** @type {Object} */
    this.pullSocket = zmq.socket("pull");

    /** @type {Boolean} */
    this.connected = false;

    /** @type {Number} - max length of db (seconds) */
    this.DB_MAX_LENGTH = 5000;

    /** @type {Map} - database of symbol databases */
    this.ratesDb = null;

    /** @type {Array} - currently opened trades */
    this.trades = null;

    /** @type {Array} - history of MT Server responses */
    this.responses = null;
  }

  /**
   * Method connects to MetaTrader server
   */
  async connect() {
    this.reqSocket.connect("tcp://127.0.0.1:" + this.reqPort);
    this.pullSocket.connect("tcp://127.0.0.1:" + this.pullPort);

    this.connected = true;
    this.ratesDb = new Map();
    this.responses = [];

    this.reqSocket.on("message", function(msg) {
      // console.log("REQ: %s", msg.toString());
    });

    // "this" references that class where event was fired..
    this.pullSocket.on("message", evt => this.handlePulledMsg(evt));
  }

  /**
   * Method handles msg from MetaTrader server
   * @param {String} msgRaw
   */
  handlePulledMsg(msgRaw) {
    let strMsg = msgRaw
      .toString()
      .replace(/'/g, '"')
      .replace(/_/g, "");

    // console.log("PULL: %s", strMsg);
    this.responses.push(strMsg);

    let obj = JSON.parse(strMsg);

    // handles when rates comes to pull socket
    if (obj.rates) {
      let db = this.ratesDb.get(obj.rates.symbol);
      if (db.length >= this.DB_MAX_LENGTH) {
        db.shift();
      }
      db.push(new SymbolValue(obj.rates.bid, obj.rates.ask));
      // db.push((obj.rates.bid + obj.rates.ask) / 2);
    }

    // handles when action comes to pull socket
    if (obj.action) {
      if (obj.action == "EXECUTION") {
        // console.log("ACTION");
        // console.log(obj);
      }
      if (obj.action == "OPENTRADES") {
        this.trades = obj.trades;
      }
    }
  }

  /**
   * Method sends REQ msg to MetaTrader server
   * @param {String} msg
   */
  sendMsg(msg) {
    if (this.connected) {
      this.reqSocket.send(msg);
    }
  }

  /**
   * Method sets new array for symbol in db and returns reference
   * or just returns reference if is already set
   * @param {String} symbol
   * @returns {Array} - reference to symbol's prices
   */
  setSymbolMonitoring(symbol) {
    if (this.ratesDb.get(symbol) === undefined) {
      this.ratesDb.set(symbol, []);
      return this.ratesDb.get(symbol);
    } else {
      return this.ratesDb.get(symbol);
    }
  }

  /**
   * Method disconnects from MetaTrader server
   */
  disconnect() {
    if (this.connected) {
      this.reqSocket.close();
      this.pullSocket.close();
      this.connected = false;
    }
  }

  /**
   * Method returns last n responses from MetaTrader server
   * @returns {Array}
   */
  getResponses() {
    return this.responses;
  }

  /**
   * @returns {Array} - Array of opened trades
   */
  getOpenedTrades() {
    return this.trades;
  }

  /**
   * Method returns if is client connected
   * @returns {Boolean}
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Method sets max length of monitored symbol array
   * @param {Number} seconds
   */
  setDbMaxLength(seconds) {
    this.DB_MAX_LENGTH = seconds;
  }
}

module.exports = Client;
