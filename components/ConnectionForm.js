import React, { Component } from "react"
import { Text, View, TextInput, StyleSheet, Button } from "proton-native"

const Client = require("../js/Client")

export default class ConnectionForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      connected: false,
      reqPort: "5555",
      pullPort: "5556",
    }

    //////////////////////////////////////////////////////////

    this.changeReqPortHandler = (reqPort) => {
      this.setState({reqPort: reqPort})
    }

    //////////////////////////////////////////////////////////
    
    this.changePullPortHandler = (pullPort) => {
      this.setState({pullPort: pullPort})
    }

    //////////////////////////////////////////////////////////

    this.btnClickHandler = () => {
      this.connect()
      this.props.setStage("Choose/Create Strategy") 
    }

    //////////////////////////////////////////////////////////
      
    ///
    /// Create connection between Client and MetaTrader
    ///
    this.connect = () => {
      if (this.state.connected) throw Error("Client is already connected!")

      // Create connection with MetaTrader - Setting client to global app state 
      const client = new Client(this.state.reqPort, this.state.pullPort)
      client.connect()

      if (client.isConnected()) {
        this.setState({ connected: true })
        this.props.setClient(client)
      }
    }
  }

  
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      container: { 
        backgroundColor: "303030", 
        marginLeft: 100,
      },
      title: { 
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white', 
      },
      subtitle: {
         fontWeight: 'bold',
         color: 'white',
      },
      txtInput: { 
        borderWidth: 1,
        fontSize: 20,
        height: '30px',
        width: '198px',
        backgroundColor: "#fff", 
        marginTop: 2,
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
      viewPull: {
        marginTop: 5,
      },
      viewReq: {
        marginTop: 25,
      },
    })

    if (this.props.appStage == "Connection") {
      return (
        <View style={styles.container }>
          <View style={styles.viewReq }>
            <Text style={ styles.subtitle }> ReqPort: </Text> 
            <TextInput
              style={ styles.txtInput }
              value={ this.state.reqPort }
              onChangeText={ this.changeReqPortHandler }
            />
          </View>
          <View style={styles.viewPull }>
            <Text style={ styles.subtitle }> PullPort: </Text> 
            <TextInput
              style={ styles.txtInput }
              value={ this.state.pullPort}
              onChangeText={ this.changePullPortHandler }
            />
          </View>
          <Button 
            style={ styles.btn } 
            title="Connect" 
            onPress={ this.btnClickHandler } 
          />
        </View>
      )
    } else return null
  }
}
