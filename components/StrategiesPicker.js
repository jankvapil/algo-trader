import React, { Component } from "react"
import { StyleSheet, View, Text, Button } from "proton-native"

export default class StrategiesPicker extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  //////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      title: { fontSize: 14, fontWeight: 'bold' },
      container: { backgroundColor: "#ece6df" },
      btn: { width: '200px' }
    })
    
    const strategies = this.props.strategyIdentifiers.map(id => (
      <View key={ id }>
        <Button 
          style={ styles.btn } 
          title={ id }
          onPress={ () => { this.props.initStrategy(id) } }
        />
      </View>
    ))

    return (
      <View>
        <Text style={ styles.title }> Select Strategy: </Text> 
        { strategies }
      </View>
     )
  }
}
