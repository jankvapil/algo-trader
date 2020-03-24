import React, { Component } from "react"
import { Picker, StyleSheet, View, Text, Button } from "proton-native"

import StrategiesPicker from "./StrategiesPicker"

const fs = require("fs")

let picker

export default class UseExistingStrategy extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadedStrategies: [],
      strategyIdentifiers: []
    }
  }

  ///////////////////////////////////////////////////////////

  ///
  /// This uninitialized indicators will be saved to file
  /// with strategy which uses this indicator
  ///
  loadStrategiesFromFile() {
    fs.readFile("./strategies.json", "utf8", (err, data) => {
      if (err) {
        console.log("File read failed:", err)
        return
      }
      const json = JSON.parse(data)

      this.setState({
        strategyIdentifiers: json.map(i => { return i.id }),
        loadedStrategies: json
      })
    })
  }

  ///////////////////////////////////////////////////////////

  ///
  /// Initialize choosen strategy
  ///
  initStrategy(id) {
    console.log(id)

    console.log(this.state.loadedStrategies.filter(s => s.id == id))

    // todo: init indicators

    // todo: init strategy
  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      title: { fontSize: 14, fontWeight: 'bold' },
      container: { 
        backgroundColor: "303030", 
        marginLeft: 100,
      },
      btn: {
        width: '200px',
        backgroundColor: "#606060", 
        color: '#141414',
        height: 32,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
      },
      btnBack: { width: '100px' },
      picker: {height: 25, width: 100, backgroundColor: '#fff'}
    })

    if (this.props.appStage == "Choose/Create Strategy") {
      return (
        <View style={ styles.container }>
          <Button 
            style={ styles.btn } 
            title="Use Existing Strategy" 
            onPress={ 
              () => {
                this.loadStrategiesFromFile()
                this.props.setStage("ChooseStrategy")
              }
            }
          />
        </View>
      )
    } else if (this.props.appStage == "ChooseStrategy") {
      return (
        <View style={ styles.container} >
          <StrategiesPicker
            strategyIdentifiers={ this.state.strategyIdentifiers }
            initStrategy={ this.initStrategy.bind(this) }
            setStage={ this.props.setStage }
            appStage={ this.props.appStage }
          />
          <Button 
            style={ styles.btnBack } 
            title="Back" 
            onPress={ 
              () => {
                this.props.setStage("Choose/Create Strategy")
              }
            }
          />
        </View>
      )
    } else return null
  }
}
