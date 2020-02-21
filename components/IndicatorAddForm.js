import React, { Component } from "react"
import { Picker, StyleSheet, View, Text, Button, TextInput } from "proton-native"

const Indicators = require("../js/Indicators")

export default class IndicatorAddForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      indicatorName: "ma10",
      timeframe: 10,
      indicator: "Moving Average"
    }

    ///
    /// Method handles btn click event
    ///
    this.addIndicator = () => { 
      let f
  
      switch(this.state.indicator) {
        case "Moving Average" : f = Indicators.average(this.state.timeframe)
          break
        default: throw Error("Undefined indicator!")
      }
  
      this.props.addIndicator({
        name: this.state.indicatorName,
        timeframe:  this.state.timeframe,
        f: f
      })
    }
  }

  //////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      container: { backgroundColor: "#ece6df" },
      title: { fontSize: 14, fontWeight: 'bold' },
      subtitle: { fontWeight: 'bold' },
      txtInput: { borderWidth: 1, width: '200px', backgroundColor: "#fff" },
      btn: { width: '200px' },
      picker: { height: 25, width: 100, backgroundColor: "#fff" }
    })
    
    return (
      <View style={ styles.container }>
        <Text style={ styles.title }> Define your indicators: </Text> 
        <Text style={ styles.subtitle }> name: </Text> 
        <TextInput
            style={ styles.txtInput }  
            value={ this.state.indicatorName }
            onChangeText={ (e) => { this.setState({indicatorName: e}) } }
        />

        <Text style={ styles.subtitle }> timeframe: </Text> 
        <TextInput
            style={ styles.txtInput }  
            value={ this.state.timeframe.toString(10) }
            onChangeText={(e) => {
              const n = Number.parseInt(e)
              if (!Number.isNaN(n)) this.setState({timeframe: n}) 
            }}
        />

        <Text style={ styles.subtitle }> indicator: </Text> 
        <Picker
          style={ styles.picker }
          selectedValue={ this.state.indicator }
          onValueChange={ (itemValue, itemIndex) => this.setState({indicator: itemValue}) }
        >
          <Picker.Item label="Moving Average" value="Moving Average" />
          <Picker.Item label="MACD todo.." value="MACD" />
        </Picker>
        
        <Button 
          style={ styles.btn } 
          title="Add" 
          onPress={ this.addIndicator.bind(this) } />
      </View>
    );
  }
}
