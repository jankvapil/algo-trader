import React, { Component } from "react"
import { Window, App, Text, Button, View, StyleSheet, TextInput, Picker } from "proton-native"

// Import necessary modules
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
      txtBid: "",
      txtAsk: "",
      indicators: [],
      openedTrades: undefined,
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
 
      if (lastPrice) {
        //
        // Sends <prices> to all strategies
        strategyManager.sendEvent(client.getOpenedTrades(), symbolArr)
        
        this.setState({
          txtBid: lastPrice.bid,
          txtAsk: lastPrice.ask,
          openedTrades: client.getOpenedTrades()
        })
      }
    }, 1000)
  }
  

  ///
  /// Renders GUI
  ///
  render() {
    const styles = StyleSheet.create({
      mainWindow: { padding: 20, width: 300, height: 500, backgroundColor: "#ece6df" }, 
      mainTitle: { fontSize: 20, fontWeight: 'bold', color: 'black' },
      viewConnect: { },
    })
    
    return (
      <App>
        <Window style={ styles.mainWindow }>
          <View style={ styles.viewConnect }>
            <Text style={ {fontSize: 14, fontWeight: 'bold'} }> MetaTrader Connection </Text>
            <Text style={{ fontWeight: 'bold' }}> ReqPort: </Text> 
            <TextInput
              style={{ borderWidth: 1, width: '200px' }}  value={this.state.reqPort}
            />
            <Text style={{ fontWeight: 'bold' }}> PullPort: </Text> 
            <TextInput
              style={{ borderWidth: 1, width: '200px' }}  value={this.state.pullPort}
            />
            <Text style={{ fontWeight: 'bold' }}> Symbol: </Text> 
            <Picker
              selectedValue={this.state.symbol}
              style={{height: 25, width: 100}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({symbol: itemValue})
              }>
              <Picker.Item label="EURUSD" value="EURUSD" />
              <Picker.Item label="GBPJPY" value="GBPJPY" />
            </Picker>
            <Button style={{ width: '200px' }} title="Connect" onPress={ () => { this._connect() } } />
          </View>
          <View>
            <Text style={{ fontWeight: 'bold' }}> ask: {this.state.txtBid} </Text>
            <Text style={{ fontWeight: 'bold' }}> bid: {this.state.txtAsk} </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{ fontWeight: 'bold' }}> openedTrades: </Text>
            <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
          </View>
        </Window>
      </App>
    );
  }
}
