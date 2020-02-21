// @ts-check

/**
 * Class represents trading strategy
 */
class Strategy {
  /**
   *
   * @param {Number} id
   * @param {Array} states
   * @param {Number} initIndex - Defines which state is initial
   * @param {Array<String>} indicators - Identifiers (names) of indicators
   * @param {Number} maxProfitRange - Profit limit when the position is ready to close 
   */
  constructor(id, states, initIndex, indicators, maxProfitRange) {
    this.id = id;
    this.states = states;
    this.state = states[initIndex];
    this.indicators = indicators;
    this.maxProfitRange = maxProfitRange;

    // Default setting of strategies transitions
    this.transitions = [
      {
        name: "INIT",
        nextStates: [
          {
            name: "SELL",
            predicate: (price, profit, indicators) => price < indicators.get("ma100")
          },
          {
            name: "BUY",
            predicate: (price, profit, indicators) => price >= indicators.get("ma100")
          }
        ]
      },
      {
        name: "SELL",
        nextStates: [
          {
            name: "CLOSE",
            predicate: (price, profit, indicators) => Math.abs(profit) > this.maxProfitRange 
          }
        ]
      },
      {
        name: "BUY",
        nextStates: [
          {
            name: "CLOSE",
            predicate: (price, profit, indicators) => Math.abs(profit) > this.maxProfitRange 
          }
        ]
      },
      {
        name: "CLOSE",
        nextStates: [
          {
            name: "INIT",
            predicate: (price, profit, indicators) => true
          }
        ]
      }
    ];
  }

  ///////////////////////////////////////////////////////////

  /**
   * Setter defines strategy
   * 
   * @param {() => boolean} sellPredicate 
   * @param {() => boolean} buyPredicate 
   */
  setTransitions(sellPredicate, buyPredicate) {
    this.transitions[0].nextStates[0].predicate = sellPredicate
    this.transitions[0].nextStates[1].predicate = buyPredicate
  }

  ///////////////////////////////////////////////////////////

  /**
   * Reference on indicators
   * 
   * @returns {Array<String>}
   */
  getIndicators() {
    return this.indicators;
  }

  ///////////////////////////////////////////////////////////

  /**
   * Updates state by the transition table.
   * 
   * @param {Number} ticket - ticket of current strategy
   * @param {Number} price - current price
   * @param {Number} profit - current profit
   * @param {Map} indicatorsValuesMap
   * @param {Number} simulated 
   */
  updateState(ticket, price, profit, indicatorsValuesMap, simulated) {
    console.log("price: ");
    console.log(price);
    console.log("indicatorsValuesMap: ");
    console.log(indicatorsValuesMap);
    console.log("current state:");
    console.log(this.state);

    // Loops throught the transitions
    for (const t of this.transitions) {
      //
      // Finds the current state
      if (this.state.name == t.name) {
        //
        // Loops throught the possible next states
        for (const ns of t.nextStates) {
          //
          // Skip the current state
          if (ns.name == this.state.name) continue;
          //
          // If predicate is satisfied
          if (ns.predicate(price, profit, indicatorsValuesMap)) {
            //
            // set the current state and finish update
            this.state = this.states.find(obj => {
              return obj.name === ns.name;
            });

            console.log("---- new state:");
            console.log(this.state);
            this.state.applyTransition(ticket, profit, simulated);
            return;
          }
        }
      }
    }
  }
}

module.exports = Strategy;
