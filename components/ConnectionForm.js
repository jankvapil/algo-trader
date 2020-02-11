import React, { Component } from "react"
import { Text, View, TextInput, StyleSheet } from "proton-native"

export default class ConnectionForm extends Component {
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
      <View style={ styles.viewConnect }>
        <Text style={ {fontSize: 14, fontWeight: 'bold'} }> MetaTrader Connection </Text>
        <Text style={{ fontWeight: 'bold' }}> ReqPort: </Text> 
        <TextInput
          style={{ borderWidth: 1, width: '200px' }}
          value={this.props.reqPort}
          onChangeText={this.props.changeReqPort}
        />
        <Text style={{ fontWeight: 'bold' }}> PullPort: </Text> 
        <TextInput
          style={{ borderWidth: 1, width: '200px' }}
          value={this.props.pullPort}
          onChangeText={this.props.changePullPort}
        />
      </View>
    );
  }
}
