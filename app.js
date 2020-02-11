import React, { Component } from "react"
import { Window, App, Text, Button, View, StyleSheet, TextInput, Picker } from "proton-native"
import OpenedTrades from "./components/OpenedTrades"
import SymbolPicker from "./components/SymbolPicker"
import ConnectionForm from "./components/ConnectionForm"

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
      openedTrades: [],
      client: undefined
    }
  
    ///
    /// Prepares Strategy Manager
    /// TODO : User defined indicators
    ///
    this.initStrategyManager = (client) => {
      //
      // Prepare indicators
      this.state.indicators.push(
        {
          name: "ma15",
          timeframe: 15,
          f: Indicators.average(15)
        },
        {
          name: "ma3",
          timeframe: 3,
          f: Indicators.average(3)
        }
      )

      return new StrategyManager(client, this.state.indicators)
    }
  }

  ///
  /// Connects to MT
  ///
  _connect() {
    if (this.state.connected) return

    // Create connection with MetaTrader - Setting global app state 
    this.setState({ connected: true,
                    client: new Client(this.state.reqPort, this.state.pullPort) })

    const symbol = this.state.symbol
    const client = this.state.client
    client.connect()

    // Set monitoring symbol & get reference on the array
    const symbolArr = client.setSymbolMonitoring(symbol)

    // Create strategy manager which handles incomming events
    const strategyManager = this.initStrategyManager(client)

    // Create new strategy (id, symbol, usedIndicators)
    strategyManager.addStrategy(66, symbol, ["ma15"])

    setInterval(() => {
      //
      // Request for opened trades
      Orders.getOpenedTrades(client)
      //
      // Request for update symbol rates
      Orders.rates(client, symbol)
      //
      // Get last price
      const lastPrice = symbolArr[symbolArr.length - 1]
 
      const openedTrades = client.getOpenedTrades()
      
      if (lastPrice) {
        //
        // Sends event to all strategies
        strategyManager.sendEvent(openedTrades, symbolArr)
        
        this.setState({
          txtBid: lastPrice.bid,
          txtAsk: lastPrice.ask,
          openedTrades: Object.values(openedTrades)
        })
      }
    }, this.state.timeframe)
  }
  
  /////////////////////// UI Changes ////////////////////////

  changeSymbol(symbol) {
    if (this.state.connected) return
    this.setState({symbol: symbol})
  } 

  changeReqPort(reqPort) {
    if (this.state.connected) return
    this.setState({reqPort: reqPort})
  }

  changePullPort(pullPort) {
    if (this.state.connected) return
    this.setState({pullPort: pullPort})
  }

  changeTimeframe(timeframe) {
    if (this.state.connected) return
    this.setState({timeframe: timeframe})
  }

  ///////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      mainWindow: { padding: 20, width: 300, height: 500, backgroundColor: "#ece6df" }
    })

    return (
      <App>
        <Window style={ styles.mainWindow }>
          <ConnectionForm 
            pullPort={this.state.pullPort} 
            reqPort={this.state.reqPort} 
            changeReqPort={this.changeReqPort.bind(this)}
            changePullPort={this.changePullPort.bind(this)}
          />
          <Text style={{ fontWeight: 'bold' }}> Timeframe: </Text> 
          <TextInput
            style={{ borderWidth: 1, width: '200px' }}  
            value={this.state.timeframe}
            onChangeText={ this.changeTimeframe.bind(this)} 
          />
          <Button style={{ width: '200px' }} title="Connect" onPress={ () => { this._connect() } } />
          <Text style={{ fontWeight: 'bold' }}> Symbol: </Text> 
          <SymbolPicker changeSymbol={ this.changeSymbol.bind(this) } />
          <View>
            <Text style={{ fontWeight: 'bold' }}> ask: {this.state.txtBid} </Text>
            <Text style={{ fontWeight: 'bold' }}> bid: {this.state.txtAsk} </Text>
          </View>
          <OpenedTrades trades={this.state.openedTrades} />
        </Window>
      </App>
    );
  }
}
