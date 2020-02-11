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
   * Sends trade buy order to MT Client
   *
   * @param {Client} client
   * @param {Number} id
   * @param {String} symbol
   *
   * @todo Create unique identifier
   */
  (client, id, symbol) => {
    let req = "TRADE|OPEN|0|"
      .concat(symbol)
      .concat("|0|0|0|")
      .concat(`${id}`)
      .concat("|0.01|123456|0");
    client.sendMsg(req);
  };

exports.sell =
  /**
   * Sends trade sell order to MT Client
   *
   * @param {Client} client
   * @param {Number} id
   * @param {String} symbol
   *
   * @todo Create unique identifier
   */
  (client, id, symbol) => {
    let req = "TRADE|OPEN|1|"
      .concat(symbol)
      .concat("|0|0|0|")
      .concat(`${id}`)
      .concat("|0.01|123456|0");
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
