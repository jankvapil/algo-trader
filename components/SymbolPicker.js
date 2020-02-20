import React, { Component } from "react"
import { Picker, StyleSheet, View, Text } from "proton-native"

export default class OpenedTrades extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  //////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      title: { fontSize: 14, fontWeight: 'bold' },
      container: { backgroundColor: "#ece6df" },
      picker: {height: 25, width: 100, backgroundColor: "#fff"}
    })
    
    return (
      <View>
        <Text style={ styles.title }> Chose your instrument: </Text> 
        <Picker
          style={ styles.picker }
          selectedValue={this.state.symbol}
          onValueChange={(itemValue, itemIndex) => this.props.changeSymbol(itemValue)}
        >
          <Picker.Item label="EURUSD" value="EURUSD" />
          <Picker.Item label="GBPJPY" value="GBPJPY" />
        </Picker>
      </View>
    );
  }
}
