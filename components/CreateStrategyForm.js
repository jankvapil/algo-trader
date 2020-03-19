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
      container: { backgroundColor: '#ece6df' },
      btn: { width: '200px' },
      btnBack: { width: '100px' },
      picker: {height: 25, width: 100, backgroundColor: '#fff'}
    })

    let content

    if (this.props.appStage == "ChooseOrCreateStrategy") {
      content = <View>
                  <Button 
                    style={ styles.btn } 
                    title="CreateStrategy" 
                    onPress={ 
                      () => {
                        this.props.setStage("CreateStrategy")
                      }
                    }
                  />
                </View>

    } else if (this.props.appStage == "CreateStrategy") {
      content = <View>
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
                        this.props.setStage("ChooseOrCreateStrategy")
                      }
                    }
                  />
                </View>

    } else content = <View></View>

    return (
      <View style={ styles.container } >  
        { content }
      </View>
    )
  }
}
