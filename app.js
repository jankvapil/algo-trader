import React, { Component } from "react"
import { Window, App, Text, Button, View, StyleSheet, TextInput, } from "proton-native"

import ConnectionForm from "./components/ConnectionForm"
import IndicatorAddForm from "./components/IndicatorAddForm"
import StrategyAddForm from "./components/StrategyAddForm"
import UseExistingStrategy from "./components/UseExistingStrategy"
import StrategySettings from './components/StrategySettings'

const Client = require("./js/Client")

const fs = require("fs")

export default class MTClient extends Component {
  constructor(props) {
    super(props)

    // console.log("Args:")
    // console.log(process.argv)

    // Global App State
    this.state = {
      connected: false,
      reqPort: "5555",
      pullPort: "5556",
      indicators: [],
      strategies: [],
      client: undefined,
      connActive: false
    }

    // Check if strategies.json exists. If not - init json.
    fs.access("./strategies.json", fs.F_OK, (err) => {
      if (err) {
        fs.writeFile("strategies.json", "[]", "utf8", () =>
          console.log("Initializing strategies.json file..")
        )
      }
    })
  }

  //////////////////////////////////////////////////////////

  // Add strategy into global app state
  addStrategy(strategy) {
    this.state.strategies.push(strategy)
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
  
  ///
  /// Create connection between Client and MetaTrader
  ///
  connect() {
    if (this.state.connected) throw Error("Client is already connected!")

    // Create connection with MetaTrader - Setting global app state 
    this.setState({ client: new Client(this.state.reqPort, this.state.pullPort) })

    if (this.state.client) {
      this.state.client.connect()
      this.setState({ connected: true })
    }
  }

  //////////////////////////////////////////////////////////

  changeReqPort(reqPort) {
    this.setState({reqPort: reqPort})
  }

  //////////////////////////////////////////////////////////
  
  changePullPort(pullPort) {
    this.setState({pullPort: pullPort})
  }
  
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      mainWindow: { padding: 20, width: 300, height: 800, backgroundColor: '#ece6df' },
      subtitle: { fontWeight: 'bold' },
      txtInput: { borderWidth: 1, width: '200px', backgroundColor: '#fff' },
      btn: { width: '200px' }
    })

    return (
      <App>
        <Window title="MT Client" style={ styles.mainWindow } >

          <ConnectionForm 
            pullPort={ this.state.pullPort } 
            reqPort={ this.state.reqPort } 
            changeReqPort={ this.changeReqPort.bind(this) }
            changePullPort={ this.changePullPort.bind(this) }
            connect={ this.connect.bind(this) }
            active={ this.state.connActive }
          />

          <Button style={ styles.btn } title="Toggle" onPress={ () => { this.setState({connActive: !this.state.connActive })} } />

          <UseExistingStrategy />

          <IndicatorAddForm 
            addIndicator={ this.addIndicator.bind(this) } 
          />

          <StrategyAddForm 
            client={ this.state.client }
            symbol={ this.state.symbol }
            indicators={ this.state.indicators }
            addStrategy={ this.addStrategy.bind(this) }
          />       
          
          <StrategySettings
            client={ this.state.client } 
          />

        </Window>
      </App>
    )
  }
}
