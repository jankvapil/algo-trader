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
   */
  constructor(id, states, initIndex, indicators) {
    this.id = id;
    this.states = states;
    this.state = states[initIndex];
    this.indicators = indicators;

    // Default setting of strategies transitions
    this.transitions = [
      {
        name: "INIT",
        nextStates: [
          {
            name: "SELL",
            predicate: (price, indicators) => price < indicators.get("ma15")
          },
          {
            name: "BUY",
            predicate: (price, indicators) => price >= indicators.get("ma15")
          }
        ]
      },
      {
        name: "SELL",
        nextStates: [
          {
            name: "BUY",
            predicate: (price, indicators) => price >= indicators.get("ma15")
          }
        ]
      },
      {
        name: "BUY",
        nextStates: [
          {
            name: "SELL",
            predicate: (price, indicators) => price < indicators.get("ma15")
          }
        ]
      }
    ];
  }

  /**
   * Reference on indicators
   * @returns {Array<String>}
   */
  getIndicators() {
    return this.indicators;
  }

  /**
   * Updates state by the transition table.
   * @param {Number} price
   * @param {Map} indicatorsValuesMap
   */
  updateState(price, indicatorsValuesMap) {
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
          if (ns.predicate(price, indicatorsValuesMap)) {
            //
            // set the current state and finish update
            this.state = this.states.find(obj => {
              return obj.name === ns.name;
            });

            console.log("---- new state:");
            console.log(this.state);

            // TODO: apply transition function of the state
            this.state.applyTransition(price);
            return;
          }
        }
      }
    }
  }
}

module.exports = Strategy;
