import React, { Component } from "react"
import { Text, View, StyleSheet } from "proton-native"

export default class OpenedTrades extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const styles = StyleSheet.create({
      title: { fontWeight: 'bold' },
      container: { backgroundColor: '#ece6df' }
    })
    
    const tradesTable = this.props.trades.map(trade => (
      <View>
        <Text>{ trade.symbol }</Text>
        <Text>{ trade.pnl }</Text>
      </View>
    ))

    return (
      <View style={ styles.container }>
        <Text style={ styles.title }>Opened Trades:</Text>
        { tradesTable }
      </View>
    );
  }
}
