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
            predicate: (price, indicators) => price < indicators.get("ma100")
          },
          {
            name: "BUY",
            predicate: (price, indicators) => price >= indicators.get("ma100")
          }
        ]
      },
      {
        name: "SELL",
        nextStates: [
          {
            name: "BUY",
            predicate: (price, indicators) => price >= indicators.get("ma100")
          }
        ]
      },
      {
        name: "BUY",
        nextStates: [
          {
            name: "SELL",
            predicate: (price, indicators) => price < indicators.get("ma100")
          }
        ]
      },
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
    this.transitions[1].nextStates[0].predicate = buyPredicate
    this.transitions[2].nextStates[0].predicate = sellPredicate
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
   * @param {Number} price - current price
   * @param {Map} indicatorsValuesMap
   */
  updateState(price, indicatorsValuesMap) {
    console.log(`price: ${ price }`);
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

          console.log(ns.predicate.toString())
          console.log(`nextState f: ${ns.predicate(price, indicatorsValuesMap)} `)
          //
          // If predicate is satisfied
          if (ns.predicate(price, indicatorsValuesMap)) {
            //
            // set the current state and finish update
            this.state = this.states.find(obj => {
              return obj.name === ns.name;
            });

            console.log("---- new state:");
            console.log(this.state);
            this.state.applyTransition();
            return;
          }
        }
      }
    }
  }
}

module.exports = Strategy;
