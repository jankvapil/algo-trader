// @ts-check

import React, { useState } from 'react'
import useGlobal from "../store"

import Layout from '../components/Layout'
import OpenedTradesList from '../components/OpenedTradesList'

import { Link } from '../router'

const Orders = require("../core/Strategy/Orders")
const StrategyManager = require('../core/StrategyManager/StrategyManager')

const IndicatorsHelper = require('../core/helpers/indicatorsHelper')


///
/// RunStrategy page
///
const RunStrategy = () => {
  
  const [globalState, globalActions] = useGlobal()

  const [price, setPrice] = useState(0)
  const [openedTrades, setOpenedTrades] = useState([])
  const [timeframe, ] = useState(1000)
  const [strategies, ] = useState(globalState.activeStrategy)

  // TODO: STOP loop
  const [run, setRun] = useState(false)
  const [loop, setLoop] = useState(null)

  ///
  /// Loop: handle btn onclick event
  ///
  const mainLoop = () => {
   
    if (globalState.connected) {

      // Hook the global variables
      const client = globalState.client
      const symbol = globalState.symbol

      // Indicators needs to be initialized
      const indicators = IndicatorsHelper.initIndicators(globalState.indicators)

      // Set monitoring symbol & get reference on the array
      const symbolArr = client.setSymbolMonitoring(symbol)
      
      // Create strategy manager who handles incomming events
      const strategyManager = new StrategyManager(client, indicators)

      // Pass strategies to strategy manager
      strategies.forEach(s => { strategyManager.addStrategy(s) })

      // Set monitored symbol's array length (don't need longer array than max timeframe)
      const maxTimeframe = Math.max(... indicators.map(i => i.timeframe))

      client.setDbMaxLength(maxTimeframe)    

      const openedTrades = client.getOpenedTrades()

      setLoop(setInterval(() => {
          //
          // Request for opened trades
          Orders.getOpenedTrades(client)
          //
          // Request for update symbol rates
          Orders.rates(client, symbol)

          const lastPrice = symbolArr[symbolArr.length - 1]
          
          console.log(openedTrades)

          // React update
          setOpenedTrades(openedTrades)

          if (lastPrice) {
            //
            // Sends event to all strategies
            strategyManager.sendEvent(openedTrades, symbolArr)
            //
            // Update app state
            setPrice(lastPrice.getPrice())
          }
      }, timeframe))    
    } else {
      console.log("Not connected")
    }
  }

  //////////////////////////////////////////////////////////

  ///
  /// STOP loop: handle btn onclick event
  ///
  const handleStop = () => {
    clearInterval(loop)
  }
  
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  return (
    <Layout>
      <h1 className="display-3">Use Existing Strategy</h1>
      <p className="lead">This page shows after selecting active strategy.</p>
      <hr className="my-4"/>
      <p>Price: { price }</p>

      
      <OpenedTradesList trades={openedTrades} />
      <button type="button" className="btn btn-primary" onClick={ mainLoop }>Start</button>
      <button type="button" className="btn btn-primary" onClick={ handleStop }>STOP</button>


      <Link className="App-link" href="/home">
        <button className="btn btn-primary btn-lg" disabled={false}>Home</button>
      </Link>
    </Layout>
  )
}

export default RunStrategy
