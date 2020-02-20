import React, { Component } from "react"
import { Window, App, Text, Button, View, StyleSheet, TextInput, Dialog  } from "proton-native"
import OpenedTrades from "./components/OpenedTrades"
import SymbolPicker from "./components/SymbolPicker"
import ConnectionForm from "./components/ConnectionForm"
import IndicatorAddForm from "./components/IndicatorAddForm"
import StrategyAddForm from "./components/StrategyAddForm"

const Client = require("./js/Client")
const Orders = require("./js/Orders")
const StrategyManager = require("./js/StrategyManager")
const Indicators = require("./js/Indicators")

export default class MTClient extends Component {
  constructor(props) {
    super(props)

    // Global App State
    this.state = {
      connected: false,
      symbol: "EURUSD",
      reqPort: "5555",
      pullPort: "5556",
      timeframe: "3000",
      txtBid: "",
      txtAsk: "",
      indicators: [],
      strategies: [],
      openedTrades: [],
      symbolArr: [],
      client: undefined
    }

    ///
    /// Main Loop..
    ///
    this.mainLoop = (strategyManager) => {
      // Request for opened trades
      Orders.getOpenedTrades(this.state.client)
      //
      // Request for update symbol rates
      Orders.rates(this.state.client, this.state.symbol)

      const symbolArr = this.state.symbolArr
      const lastPrice = symbolArr[symbolArr.length - 1]
      const openedTrades = this.state.client.getOpenedTrades()
      
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

  //////////////////////////////////////////////////////////
  /////////////////////// UI Events ////////////////////////

  // Fire main-event loop
  startLoop() {
    
    if (!this.state.connected) throw Error("Client is not connected!")

    //
    // TODO:
    //
    // CHECK IF THERE IS NO STRATEGIES INDENTIFIED BY SAME ID !!!
    // or
    // SEND ORDER TO CLOSE ALL POSITIONS WITH THIS ID
    // const openedTrades = this.state.client.getOpenedTrades() ..


    // Set monitoring symbol & get reference on the array
    this.setState({symbolArr : client.setSymbolMonitoring(symbol)})

    // Create strategy manager who handles incomming events
    const strategyManager = new StrategyManager(client, this.state.indicators)

    // Pass strategies to strategy manager
    this.state.strategies.forEach(s => { strategyManager.addStrategy(s) })

    // Set monitored symbol's array length (don't need longer array than max timeframe)
    const maxTimeframe = Math.max(... this.state.indicators.map(i => i.timeframe))
    this.client.setDbMaxLength(maxTimeframe)

    setInterval(() => { this.mainLoop(strategyManager) }, this.state.timeframe)
  }

  //////////////////////////////////////////////////////////

  // Add strategy into global app state
  addStrategy(strategy) {
    this.state.strategies.push(strategy);
  }

  //////////////////////////////////////////////////////////

  // Add indicator into global app state
  addIndicator(newIndicator) {
    //
    // Check if indicator is unique
    for (let i of this.state.indicators) {
      console.log(i.name)
      if (i.name == newIndicator.name) throw Error("This indicator is already defined!")
    }

    // TODO: Inform user that indicator has been added by GUI Custom Dialog..

    // Dialog("Message", {title: "Dialog", description: "I.."})
    console.log(`Indicator ${newIndicator.name} has been added!`) 

    this.state.indicators.push(newIndicator)
  }

  //////////////////////////////////////////////////////////

  changeSymbol(symbol) {
    this.setState({symbol: symbol})
  } 

  //////////////////////////////////////////////////////////
  
  changeReqPort(reqPort) {
    this.setState({reqPort: reqPort})
  }

  //////////////////////////////////////////////////////////
  
  changePullPort(pullPort) {
    this.setState({pullPort: pullPort})
  }

  //////////////////////////////////////////////////////////
  
  changeTimeframe(timeframe) {
    this.setState({timeframe: timeframe})
  }

  //////////////////////////////////////////////////////////
  
  // Create connection between Client and MetaTrader
  connect() {
    if (this.state.connected) throw Error("Client is already connected!")

    // Create connection with MetaTrader - Setting global app state 
    this.setState({ client: new Client(this.state.reqPort, this.state.pullPort) })

    if (this.state.client) {
      this.state.client.connect()
      this.setState({ connected: true })
    }
  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      mainWindow: { padding: 20, width: 300, height: 500, backgroundColor: "#ece6df" },
      subtitle: { fontWeight: 'bold' },
      txtInput: { borderWidth: 1, width: '200px', backgroundColor: "#fff" }
    })

    return (
      <App>
        <Window style={ styles.mainWindow }>
          <ConnectionForm 
            pullPort={ this.state.pullPort } 
            reqPort={ this.state.reqPort } 
            changeReqPort={ this.changeReqPort.bind(this) }
            changePullPort={ this.changePullPort.bind(this) }
            connect={ this.connect.bind(this) }
          />
          <SymbolPicker changeSymbol={ this.changeSymbol.bind(this) } />
          <IndicatorAddForm addIndicator={ this.addIndicator.bind(this) } />
          <StrategyAddForm 
            client={ this.state.client }
            symbol={ this.state.symbol }
            indicators={ this.state.indicators }
            addStrategy={ this.addStrategy.bind(this) }
          />

          <Text style={ styles.subtitle }> Timeframe: </Text> 
          <TextInput
            style={ styles.txtInput }  
            value={ this.state.timeframe }
            onChangeText={ this.changeTimeframe.bind(this) } 
          />
          
          <View>
            <Text style={ styles.subtitle }> ask: { this.state.txtBid } </Text>
            <Text style={ styles.subtitle }> bid: { this.state.txtAsk } </Text>
          </View>
          <OpenedTrades trades={ this.state.openedTrades } />
        </Window>
      </App>
    );
  }
}
