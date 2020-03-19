import React, { Component } from "react"
import { Picker, StyleSheet, View, Text, TextInput, Button } from "proton-native"

import SymbolPicker from "./SymbolPicker"
import OpenedTrades from "./OpenedTrades"

const Orders = require("../js/Orders")
const StrategyManager = require("../js/StrategyManager")


export default class StrategySettings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timeframe: "1000",
      symbol: "EURUSD",
      txtBid: "",
      txtAsk: "",
      symbolArr: [],
      openedTrades: []
    }

    ///
    /// Main Loop..
    ///
    this.mainLoop = (strategyManager) => {
      // Request for opened trades
      Orders.getOpenedTrades(this.props.client)
      //
      // Request for update symbol rates
      Orders.rates(this.props.client, this.state.symbol)

      const symbolArr = this.state.symbolArr
      const lastPrice = symbolArr[symbolArr.length - 1]
      const openedTrades = this.props.client.getOpenedTrades()
      
      if (lastPrice) {
        //
        // Sends event to all strategies
        strategyManager.sendEvent(openedTrades, symbolArr)
        //
        // Update app state
        this.setState({
          txtBid: lastPrice.bid,
          txtAsk: lastPrice.ask,
          openedTrades: Object.values(openedTrades)
        })
      }
    }
  }

  ///////////////////////////////////////////////////////////

  ///
  /// main-event loop
  ///

  startLoop() {
    
    const client = this.props.client
    const symbol = this.state.symbol

    // Set monitoring symbol & get reference on the array
    this.setState({symbolArr : client.setSymbolMonitoring(symbol)})

    // Create strategy manager who handles incomming events
    const strategyManager = new StrategyManager(client, this.props.indicators)

    // Pass strategies to strategy manager
    this.props.strategies.forEach(s => { strategyManager.addStrategy(s) })

    // Set monitored symbol's array length (don't need longer array than max timeframe)
    const maxTimeframe = Math.max(... this.props.indicators.map(i => i.timeframe))
    client.setDbMaxLength(maxTimeframe)

    setInterval(() => { this.mainLoop(strategyManager) }, this.state.timeframe)
  }

  //////////////////////////////////////////////////////////

  changeSymbol(symbol) {
    this.setState({symbol: symbol})
    this.props.setSymbol(symbol)
  } 

  //////////////////////////////////////////////////////////
  
  changeTimeframe(timeframe) {
    this.setState({timeframe: timeframe})
  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      title: { fontSize: 14, fontWeight: 'bold' },
      container: { backgroundColor: '#ece6df' },
      btn: { width: '200px' },
      txtInput: { borderWidth: 1, width: '200px', backgroundColor: '#fff' },
      picker: {height: 25, width: 100, backgroundColor: '#fff'}
    })

    let content

    if (this.props.appStage == "StrategySettings") {
      content = <View>
                  <SymbolPicker changeSymbol={ this.changeSymbol.bind(this) } />
                    <Text style={ styles.subtitle }> Timeframe: </Text> 
                    <TextInput
                      style={ styles.txtInput }  
                      value={ this.state.timeframe }
                      onChangeText={ this.changeTimeframe.bind(this) } 
                    />
                    <Button 
                      style={ styles.btn } 
                      title="Start" 
                      onPress={ this.startLoop.bind(this) } />
                    <View>
                      <Text style={ styles.subtitle }> ask: { this.state.txtBid } </Text>
                      <Text style={ styles.subtitle }> bid: { this.state.txtAsk } </Text>
                    </View>
                    <OpenedTrades trades={ this.state.openedTrades } /> 
                </View>

    } else content = <View></View>


    return (
      <View>
        { content }
      </View>
    )
  }
}
