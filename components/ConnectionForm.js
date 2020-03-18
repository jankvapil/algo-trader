import React, { Component } from "react"
import { Text, View, TextInput, StyleSheet, Button } from "proton-native"

export default class ConnectionForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  //////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      container: { backgroundColor: "#ece6df" },
      title: { fontSize: 14, fontWeight: 'bold' },
      subtitle: { fontWeight: 'bold' },
      txtInput: { borderWidth: 1, width: '200px', backgroundColor: "#fff" },
      btn: { width: '200px' }
    })

    let content;

    if (this.props.active) {
      content = <View>
                  <Text style={ styles.title }> MetaTrader Connection </Text>
                  <Text style={ styles.subtitle }> ReqPort: </Text> 
                  <TextInput
                    style={ styles.txtInput }
                    value={ this.props.reqPort }
                    onChangeText={ this.props.changeReqPort }
                  />
                  <Text style={ styles.subtitle }> PullPort: </Text> 
                  <TextInput
                    style={ styles.txtInput }
                    value={ this.props.pullPort}
                    onChangeText={ this.props.changePullPort }
                  />
                  <Button style={ styles.btn } title="Connect" onPress={ () => { this.props.connect() } } />
                </View>

    } else content = <View></View>

    return (
      <View style={ styles.container }>
        { content }
      </View>
    );
  }
}
