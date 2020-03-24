import React, { Component } from "react"
import { Picker, StyleSheet, View, Text, Button } from "proton-native"

import IndicatorAddForm from "./IndicatorAddForm"
import StrategyAddForm from "./StrategyAddForm"


export default class CreateStrategyForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  ///////////////////////////////////////////////////////////

  ///
  /// Tododo
  ///
 

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  render() {
    const styles = StyleSheet.create({
      title: { fontSize: 14, fontWeight: 'bold' },
      container: { 
        backgroundColor: "303030", 
        marginLeft: 100,
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
      btnBack: { width: '100px' },
      picker: {height: 25, width: 100, backgroundColor: '#fff'}
    })

    if (this.props.appStage == "Choose/Create Strategy") {
      return (
        <View style={ styles.container }>
          <Button 
            style={ styles.btn } 
            title="Create Strategy" 
            onPress={ 
              () => {
                this.props.setStage("CreateStrategy")
              }
            }
          />
        </View>
      )
    } else if (this.props.appStage == "CreateStrategy") {
        return (
          <View style={ styles.container }>
            <IndicatorAddForm 
              addIndicator={ this.props.addIndicator } 
            />
            <StrategyAddForm 
              client={ this.props.client }
              symbol={ this.props.symbol }
              indicators={ this.props.indicators }
              addStrategy={ this.props.addStrategy }
            />    
            <Button 
              style={ styles.btnBack } 
              title="Back" 
              onPress={ 
                () => {
                  this.props.setStage("Choose/Create Strategy")
                }
              }
            />
          </View>
        )
    } else return null
  }
}
