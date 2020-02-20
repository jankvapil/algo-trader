import React, { Component } from "react"
import { Picker, StyleSheet, View, Text } from "proton-native"

export default class OpenedTrades extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const styles = StyleSheet.create({
      title: { fontWeight: 'bold' },
      container: { backgroundColor: "#eeffff" }
    })
    
    return (
      <View>
        <Text style={{ fontWeight: 'bold' }}> Chose your instrument: </Text> 
        <Picker
          selectedValue={this.state.symbol}
          style={{height: 25, width: 100}}
          onValueChange={(itemValue, itemIndex) => this.props.changeSymbol(itemValue)}
        >
          <Picker.Item label="EURUSD" value="EURUSD" />
          <Picker.Item label="GBPJPY" value="GBPJPY" />
        </Picker>
      </View>
    );
  }
}
