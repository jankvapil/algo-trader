import React, { Component } from "react"
import { Picker, StyleSheet, View, Text, Button, TextInput } from "proton-native"

const Strategy = require("../js/Strategy");
const State = require("../js/State");

export default class StrategyAddForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      strategyId: 0,
      initState: 0,
      maxProfitRange: 0.10,
      sellPredicate: `price < indicators.get("ma100")`,
      buyPredicate: `price >= indicators.get("ma100")`
    }

    ///
    /// Method handles btn click event
    ///
    this.addStrategy = () => { 
      //
      // TODO: Indicators Selection
      const usedIndicators = this.props.indicators.map(i => i.name)
      console.log(usedIndicators)

      // Create new strategy (id, symbol, usedIndicators)
      const s = this.createStrategy(usedIndicators, this.props.client, this.props.symbol)

      // TODO
      this.defineStrategy(s)

      this.props.addStrategy(s)
    }
  }
  
  //////////////////////////////////////////////////////////

  ///
  /// TODO
  ///
  createStrategy(indicators, client, symbol) {

    // Creates new strategy
    const strat = new Strategy(
      this.state.strategyId,
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
      this.state.initState,
      indicators,
      this.state.maxProfitRange
    )

    return strat;
  }

  //////////////////////////////////////////////////////////

  ///
  /// TODO
  ///
  defineStrategy(s) {

    let buyStr = `(price, profit, indicators) => `.concat(this.state.buyPredicate)

    let sellStr = `(price, profit, indicators) => `.concat(this.state.sellPredicate)

    console.log(buyStr)

    console.log(sellStr)
    
  }

  //////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      container: { backgroundColor: "#ece6df" },
      title: { fontSize: 14, fontWeight: 'bold' },
      subtitle: { fontWeight: 'bold' },
      txtInput: { borderWidth: 1, width: '200px', backgroundColor: "#fff" },
      btn: { width: '200px' },
      txtInputStrategyDef: { borderWidth: 1, width: '200px', height: '50px' , backgroundColor: "#fff" }
    })
    
    return (
      <View style={ styles.container }>
        <Text style={ styles.title }> Define your strategy: </Text>
        <Text style={ styles.subtitle }> Strategy ID: </Text>
        <TextInput 
            style={ styles.txtInput }
            value={ this.state.strategyId }
        />
        <Text style={ styles.subtitle }> Max Profit Range: </Text>
        <TextInput 
            style={ styles.txtInput }
            value={ this.state.maxProfitRange }
        />
        <Text style={ styles.subtitle }> SELL Predicate: </Text>
        <TextInput 
            style={ styles.txtInputStrategyDef }
            value={ this.state.sellPredicate }
        />
        <Text style={ styles.subtitle }> BUY Predicate: </Text>
        <TextInput 
            style={ styles.txtInputStrategyDef }
            value={ this.state.buyPredicate }
        />
        <Button 
          style={ styles.btn }
          title="Add"
          onPress={ this.addStrategy.bind(this) } 
        />
      </View> 
    );
  }
}
