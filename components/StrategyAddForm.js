import React, { Component } from "react"
import { Picker, StyleSheet, View, Text, Button, TextInput } from "proton-native"

const Strategy = require("../js/Strategy");
const State = require("../js/State");

export default class StrategyAddForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }
  
  //////////////////////////////////////////////////////////

  createStrategy(indicators, client, symbol) {

    // Creates new strategy
    const strat = new Strategy(
      strategyId,
      [
        new State("INIT", () => {}),

        new State("SELL", (ticket, profit, simulated) => {
          if (!simulated)
            Orders.sell(client, strategyId, symbol);
        }),

        new State("BUY", (ticket, profit, simulated) => {
          if (!simulated)
            Orders.buy(client, strategyId, symbol);
        }),

        new State("CLOSE", (ticket, profit, simulated) => {
          if (simulated) {
            // TODO: Save fitness to db as simulated
          } else {
            // TODO: Save fitness to db as real
            Orders.closeOrder(client, ticket);
          }
        })
      ],
      0,
      indicators,
      0.10
    )

    return strat;
  }

  //////////////////////////////////////////////////////////

  // TODO
  defineStrategy(s) {

  }

  //////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      title: { fontWeight: 'bold' },
      container: { backgroundColor: "#eeffff" }
    })
    
    return (
      <View>
        <Text style={{ fontWeight: 'bold' }}> Define your strategy: </Text>
        <Button 
          style={{ width: '200px' }} 
          title="Add" 
          onPress={ () => { 
            this.props.indicators.map(i => console.log(i))

            // Create new strategy (id, symbol, usedIndicators)
            const usedIndicators = this.props.indicators.map(i => i.name)
            console.log(usedIndicators)

            const s = this.createStrategy(usedIndicators, this.props.client, this.props.symbol)

            // TODO
            this.defineStrategy(s)

            this.props.addStrategy(s)
          }} />
      </View> 
    );
  }
}
