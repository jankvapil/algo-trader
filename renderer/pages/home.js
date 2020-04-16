import React, { useState } from 'react'

import Layout from '../components/Layout'
import ConnectionForm from '../components/ConnectionForm'

import useGlobal from "../store"

///
/// Homepage 
///
const Home = () => {

  const [globalState, globalActions] = useGlobal()

  const [price, setPrice] = useState(0)

  ///
  /// Loop: handle btn onclick event
  ///
  const loop = () => {
   
    if (globalState.connected) {
      console.log(globalState.client)
      console.log("Running loop")

      const client = globalState.client;

      const Orders = require("../core/Orders")
      console.log(client)

      const symbol = "EURUSD"
      const symbolArr = client.setSymbolMonitoring(symbol)

      setInterval(function(){
          // Request for opened trades
          Orders.getOpenedTrades(client)
          Orders.rates(client, symbol)
          const lastPrice = symbolArr[symbolArr.length - 1]

          if (lastPrice)
            setPrice(lastPrice.getPrice())

      }, 3000)    
    } else {
      console.log("Not connected")
    }
  }

  return (
    <Layout>
      
      <h1 className="display-3">Welcome!</h1>
      <p className="lead">
        Make sure that your Metatrader Expert-Advisor is running on the same ports as you are connecting to.
        { price }
      </p>
      <hr className="my-4" />
      <ConnectionForm />
     
      <button onClick={loop}>Loop</button>
    </Layout>
  )
}

export default Home
