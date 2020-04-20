import React, { useState } from 'react'
import useGlobal from "../store"

import Layout from '../components/Layout'

const Orders = require("../core/Orders")
const StrategyManager = require('../core/StrategyManager')

///
/// RunStrategy page
///
const RunStrategy = () => {
  
  const [globalState, globalActions] = useGlobal()

  const [price, setPrice] = useState(0)
  const [openedTrades, setOpenedTrades] = useState([])
  const [timeframe, ] = useState(1000)

  const [activeStrategy, setActiveStrategy] = useState(globalState.activeStrategy)
  

  const [activeIndicators, setActiveIndicators] = useState([])



  ///
  /// Loop: handle btn onclick event
  ///
  const loop = () => {
   
    if (globalState.connected) {

      console.log("ACTIVE INDICATORS")
      console.log(activeIndicators)

      // console.log(globalState.client)
      // console.log("Running loop")

      const client = globalState.client
      const symbol = globalState.symbol
      const strategies = activeStrategy

      ////////
      // TODO: přepsat - je třeba inicializovat indikátor až ve chvíli, kdy se načte tato stránka

      const indicators = globalState.indicators
      // TODO
      ///////

      // Set monitoring symbol & get reference on the array
      const symbolArr = client.setSymbolMonitoring(symbol)
      
      // Create strategy manager who handles incomming events
      const strategyManager = new StrategyManager(client, indicators)

      console.log("Passing strategies")
      console.log(strategies)
      console.log(indicators)

      // Pass strategies to strategy manager
      strategies.forEach(s => { strategyManager.addStrategy(s) })

      // Set monitored symbol's array length (don't need longer array than max timeframe)
      const maxTimeframe = Math.max(... indicators.map(i => i.timeframe))

      client.setDbMaxLength(maxTimeframe)    

      setInterval(() => {
          //
          // Request for opened trades
          Orders.getOpenedTrades(client)
          //
          // Request for update symbol rates
          Orders.rates(client, symbol)

          const lastPrice = symbolArr[symbolArr.length - 1]
          const openedTrades = client.getOpenedTrades()

          if (lastPrice) {
            //
            // Sends event to all strategies
            strategyManager.sendEvent(openedTrades, symbolArr)
            //
            // Update app state
            setPrice(lastPrice.getPrice())
            setOpenedTrades(Object.values(openedTrades))
          }
      }, timeframe)    
    } else {
      console.log("Not connected")
    }
  }

  return (
    <Layout>
      <h1 className="display-3">Use Existing Strategy</h1>
      <p className="lead">This page shows after connecting to MetaTrader.</p>
      <hr className="my-4"/>
      <p>{ price }</p>
      <button type="button" className="btn btn-primary" onClick={ loop }>Start</button>
    </Layout>
  )
}

export default RunStrategy
