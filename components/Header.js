import React, { Component } from "react"
import { Text, View, StyleSheet } from "proton-native"

export default class ConnectionForm extends Component {
  constructor(props) {
    super(props)

    this.state = { }
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      container: { 
        backgroundColor: "#282828", 
        paddingLeft: 50,
        paddingTop: 30,
      },
      title: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
      },
      separator: {
        marginTop: 10,
        width: 300,
        height: 2,
        backgroundColor: "#fefefe",
      },
    })

    return (
      <View style={styles.container }>
        <Text style={ styles.title }> { this.props.title } </Text>
        <View style={ styles.separator } />
      </View>
    )
  }
}
