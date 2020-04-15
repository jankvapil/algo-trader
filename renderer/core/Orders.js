// @ts-check

const Client = require("./Client");

exports.rates =
  /**
   * Sends rates order to MT Client
   *
   * @param {Client} client
   * @param {String} symbol
   */
  (client, symbol) => {
    let req = "RATES|".concat(symbol);
    client.sendMsg(req);
  };

exports.buy =
  /**
   * Sends buy order to MT Client
   *       TRADE|ACTION|TYPE|SYMBOL|PRICE|SL|TP|COMMENT|TICKET
   *  e.g. TRADE|OPEN|1|EURUSD|0|50|50|R-to-MetaTrader4|12345678
   *
   * @param {Client} client
   * @param {Number} id
   * @param {String} symbol
   * @param {Number} lotSize
   *
   * @todo Create unique identifier
   */
  (client, id, symbol, lotSize, stopLoss, takeProfit) => {
    let req = "TRADE|OPEN|0|"
      .concat(symbol)
      .concat(`|0|${stopLoss}|${takeProfit}|`)
      .concat(`${id}`)
      .concat(`|${lotSize}|123456|0`);
    
    console.log(req)
    client.sendMsg(req);
  };

exports.sell =
  /**
   * Sends sell order to MT Client
   *
   * @param {Client} client
   * @param {Number} id
   * @param {String} symbol
   * @param {Number} lotSize
   *
   * @todo Create unique identifier
   */
  (client, id, symbol, lotSize, stopLoss, takeProfit) => {
    let req = "TRADE|OPEN|1|"
      .concat(symbol)
      .concat(`|0|${stopLoss}|${takeProfit}|`)
      .concat(`${id}`)
      .concat(`|${lotSize}|123456|0`);

    console.log(req) 
    client.sendMsg(req);
  };

exports.closeOrder =
  /**
   * Sends close order by ticket to MT Client
   *
   * @param {Client} client
   * @param {String} ticket
   *
   * @todo Create unique identifier
   */
  (client, ticket) => {
    let req = "TRADE|CLOSE|0|EURUSD|0|50|50|Node-to-MT4|0.01|123456|".concat(
      ticket
    );
    client.sendMsg(req);
  };

exports.getOpenedTrades =
  /**
   * Sends get open trades order to MT Client
   * @param {Client} client
   */
  client => {
    let req = "GET_OPEN_TRADES";
    client.sendMsg(req);
  };
