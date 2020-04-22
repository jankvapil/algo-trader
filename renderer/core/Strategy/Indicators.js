// @ts-check

/**
 * @param {Number} n - length of array.
 * @returns {Function} - prepared function appliable with array of numbers
 */
exports.average = n => {
  /**
   * @param {Array<Number>} db - array of numbers
   * @returns {Number} - avarage value of the array.
   */
  return db => {
    if (db.length != n)
      throw new Error(`Input array have to had size ${n} not ${db.length}.`);

    return db.reduce((a, b) => a + b, 0) / n;
  };
};
