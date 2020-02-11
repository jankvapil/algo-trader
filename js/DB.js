// @ts-check

/**
 * Function saves order into database
 *
 * @param {Object} db
 * @param {Number} stratId
 * @param {String} symbol
 * @param {Number} price
 * @param {Boolean} position - true = BUY, false = SELL
 */
exports.saveOrder = (db, stratId, symbol, price, position) => {
  let res = db("orders").insert({
    strategy_id: stratId,
    symbol: symbol,
    price: price,
    position: position
  });

  res.then(rows => {
    // console.log(`Inserted ${rows}. row into orders table!`);
  });
};
