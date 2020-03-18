import React, { Component } from "react"
import { Picker, StyleSheet, View, Text, Button, TextInput } from "proton-native"

const Strategy = require("../js/Strategy");
const State = require("../js/State");
const Orders = require("../js/Orders");

const fs = require('fs');

export default class StrategyAddForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      strategyId: 1,
      initState: 0,
      stopLoss: 10,
      takeProfit: 10,
      lotSize: 0.01,
      sellPredicate: `price < indicators.get("ma10")`,
      buyPredicate: `price >= indicators.get("ma10")`
    }

    ///
    /// Method handles btn click event
    ///
    this.addStrategy = () => { 
      //
      // Choose used indicators
      const usedIndicators = this.props.indicators.map(i => i.name)
      
      // TODO: HANDLE THIS ERROR
      if (this.state.strategyId == 0) {
        throw Error("Strategies with id 0 are manually placed!")
      }

      // Create new strategy (id, symbol, usedIndicators)
      const s = this.createStrategy(usedIndicators, this.props.client, this.props.symbol)

      this.defineStrategy(s)
      this.props.addStrategy(s)
    }
  }
  
  //////////////////////////////////////////////////////////

  ///
  /// Creates new strategy
  ///
  createStrategy(indicators, client, symbol) {

    console.log(`New strategy created.
      ID: ${ this.state.strategyId }
      SL: ${ this.state.stopLoss }
      TP: ${ this.state.takeProfit }
      SELL: ${ this.state.sellPredicate }
      BUY: ${ this.state.buyPredicate } `)

    const strat = new Strategy(
      this.state.strategyId,
      [
        new State("INIT", () => {}),

        new State("SELL", () => {
            Orders.sell(
              client,
              this.state.strategyId,
              symbol,
              this.state.lotSize,
              this.state.stopLoss,
              this.state.takeProfit
            );
        }),

        new State("BUY", () => {
            Orders.buy(
              client,
              this.state.strategyId,
              symbol,
              this.state.lotSize,
              this.state.stopLoss,
              this.state.takeProfit
            );
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
  /// Defines strategy by SELL / BUY transitions
  ///
  defineStrategy(s) {
    s.setTransitions(
      eval(`(price, indicators) => `.concat(this.state.sellPredicate)),
      eval(`(price, indicators) => `.concat(this.state.buyPredicate))
    );   
  }

  //////////////////////////////////////////////////////////

  ///
  /// Saves strategy to JSON file
  ///
  saveStrategy() {
    const savedStrat = {
      id: this.state.strategyId,
      indicators: this.props.uninitIndicators,
      strategy: {
        symbol: this.props.symbol,
        sl: this.state.stopLoss,
        tp: this.state.takeProfit,
        lotSize: this.state.lotSize,
        sellPredicate: this.state.sellPredicate,
        buyPredicate: this.state.buyPredicate
      }
    }

    fs.readFile('./strategies.json', 'utf8', (err, data) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        const json = JSON.parse(data);

        json.map(i => {
          if (i.id == this.state.strategyId) 
            throw Error(`Chose unique indentifier of strategy. Strategy ${i.id} is already defined!`)
        })

        json.push(savedStrat)
        console.log(json)

        const str = JSON.stringify(json, null, 2)

        fs.writeFile("strategies.json", str, "utf8", () =>
          console.log("saving file..")
        )
    })
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
            onChangeText={ (e) => { 
              this.setState({ strategyId: e }) } 
            }
        />
        <Text style={ styles.subtitle }> Max Profit Range: </Text>

        <Text style={ styles.subtitle }> Stop Loss: </Text>
        <TextInput 
            style={ styles.txtInput }
            value={ this.state.stopLoss }
            onChangeText={ (e) => { this.setState({ stopLoss: e }) } }
        />
        <Text style={ styles.subtitle }> Take Profit: </Text>
        <TextInput 
            style={ styles.txtInput }
            value={ this.state.takeProfit }
            onChangeText={ (e) => { this.setState({ takeProfit: e }) } }
        />

        <Text style={ styles.subtitle }> Lot Size: </Text>
        <TextInput 
            style={ styles.txtInput }
            value={ this.state.lotSize }
            onChangeText={ (e) => { this.setState({ lotSize: e }) } }
        />
        <Text style={ styles.subtitle }> SELL Predicate: </Text>
        <TextInput 
            style={ styles.txtInputStrategyDef }
            multiline={ true } 
            value={ this.state.sellPredicate }
            onChangeText={ (e) => { this.setState({ sellPredicate: e }) } }
        />
        <Text style={ styles.subtitle }> BUY Predicate: </Text>
        <TextInput 
            style={ styles.txtInputStrategyDef }
            multiline={ true } 
            value={ this.state.buyPredicate }
            onChangeText={ (e) => { this.setState({ buyPredicate: e }) } }
        />
        <Button 
            style={ styles.btn } 
            title="Save Strategy" 
            onPress={ this.saveStrategy.bind(this) } />  

        <Button 
          style={ styles.btn }
          title="Add"
          onPress={ this.addStrategy.bind(this) } 
        />
      </View> 
    );
  }
}
