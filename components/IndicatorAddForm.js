import React, { Component } from "react"
import { Picker, StyleSheet, View, Text, Button, TextInput } from "proton-native"

const Indicators = require("../js/Indicators")

export default class IndicatorAddForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      indicatorName: "ma100",
      timeframe: 100,
      indicator: "Moving Average"
    }
  }


  render() {
    const styles = StyleSheet.create({
      title: { fontWeight: 'bold' },
      container: { backgroundColor: "#eeffff" }
    })
    
    return (
      <View>
        <Text style={{ fontWeight: 'bold' }}> Define your indicators: </Text> 
        <Text> name: </Text> 
        <TextInput
            style={{ borderWidth: 1, width: '200px' }}  
            value={this.state.indicatorName}
            onChangeText={(e) => {
              this.setState({indicatorName: e})
          }}
        />

        <Text> timeframe: </Text> 
        <TextInput
            style={{ borderWidth: 1, width: '200px' }}  
            value={ this.state.timeframe.toString(10) }
            onChangeText={(e) => {
              const n = Number.parseInt(e)
              if (!Number.isNaN(n)) this.setState({timeframe: n}) 
            }}
        />

        <Text> indicator: </Text> 
        <Picker
          selectedValue={this.state.indicator}
          style={{height: 25, width: 100}}
          onValueChange={(itemValue, itemIndex) => this.setState({indicator: itemValue})}
        >
        <Picker.Item label="Moving Average" value="Moving Average" />
        <Picker.Item label="MACD todo.." value="MACD" />
      </Picker>
        
        <Button 
          style={{ width: '200px' }} 
          title="Add" 
          onPress={ () => { 
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
          }} />
      </View>
    );
  }
}
