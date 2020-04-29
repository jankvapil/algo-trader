// @ts-check

import React, { useState } from 'react'
import useGlobal from "../store"

import Layout from '../components/Layout'
import OpenedTradesList from '../components/OpenedTradesList'
import ErrorModal from '../components/ErrorModal'

import { Link } from '../router'

const Mainloop = require('../core/StrategyManager/Mainloop')


///
/// RunStrategy page
///
const RunStrategy = () => {
  
  ///// DATA 
  
  const [globalState, globalActions] = useGlobal()

  const [price, setPrice] = useState(0)
  const [openedTrades, setOpenedTrades] = useState([])
  const [timeframe, setTimeframe] = useState(1000)
  const [symbol, setSymbol] = useState("EURUSD")
  const [tradeDelay, setTradeDelay] = useState(5000)
  const [run, setRun] = useState(false)
  const [loop, setLoop] = useState(null)

  ///// GUI

  const [timeframeInputClass, setTimeframeInputClass] = useState("form-control")
  const [delayInputClass, setDelayInputClass] = useState("form-control")
  const [showError, setShowError] = useState(false)

  //////////////////////////////////////////////////////////

  ///
  /// Loop: handle btn onclick event
  ///
  const mainLoop = () => {
   
    if (globalState.connected) {

      // create main loop
      const loop = Mainloop.run(
        globalState.client,
        symbol,
        timeframe,
        tradeDelay,
        globalState.indicators,
        globalState.activeStrategy,
        setOpenedTrades,
        setPrice
      )

      // save loop in component state
      setLoop(loop)

    } else {
      throw Error("Not connected!")
    }
  }

  //////////////////////////////////////////////////////////

  ///
  /// STOP btn: handle onClick event
  ///
  const handleStop = () => {
    clearInterval(loop)
    setRun(false)
  }
  
  //////////////////////////////////////////////////////////

  ///
  /// START btn: handle onClick event
  ///
  const handleStart = () => {
    if (timeframe >= 1000) {
      if (tradeDelay >= 1000) {
        
        try {
          mainLoop()
          setRun(true)
        } catch (e) {
          setShowError(true)
          console.error(e)
        }
        
      } else {
        setDelayInputClass("form-control is-invalid")
      }
    } else {
      setTimeframeInputClass("form-control is-invalid")
    }
  }
  
  //////////////////////////////////////////////////////////

  ///
  /// Timeframe: handle onChange event
  ///
  const handleTimeframeChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value)) {
      setTimeframe(0)
      setTimeframeInputClass("form-control")
    } else if (value < 0) {
      setTimeframe(value * (-1))
    } else setTimeframe(value)
  }

  //////////////////////////////////////////////////////////

  ///
  /// Trade Delay: handle onChange event
  ///
  const handleDelayChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value)) {
      setTradeDelay(0)
      setDelayInputClass("form-control")
    } else if (value < 0) {
      setTradeDelay(value * (-1))
    } else setTradeDelay(value)
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  return (
    <Layout>
      <h1 className="display-3">Start Trading</h1>
      <p className="lead">This page shows after selecting active strategy.</p>
      <hr className="my-4"/>
      <p>Price: { price }</p>

      <h3>Select Symbol</h3>

      <div className="form-group">
        <select 
          className="custom-select" 
          style={{width: 200}}
          onChange={(e) => setSymbol(e.target.value)} 
          defaultValue={symbol}
        >
          <option value="EURUSD">EURUSD</option>
          <option value="USDJPY">USDJPY</option>
          <option value="GBPUSD">GBPUSD</option>
        </select>
      </div>

      <div className="form-group has-danger">
        <label className="col-form-label" htmlFor="inputDefault">Timeframe: (ms)</label>
        <input 
          type="text"
          style={{width: 200}} 
          className={timeframeInputClass}
          placeholder="Default input" 
          id="inputDefault" 
          value={timeframe}
          onChange={ handleTimeframeChange } />
        <div className="invalid-feedback">Please set timeframe >= 1000ms.</div>
      </div>
      
      <div className="form-group has-danger">
        <label className="col-form-label" htmlFor="inputDefault">Order Delay: (ms)</label>
        <input 
          type="text"
          style={{width: 200}} 
          className={delayInputClass}
          placeholder="Default input" 
          id="inputDefault" 
          value={tradeDelay}
          onChange={ handleDelayChange } />
        <div className="invalid-feedback">Please set order delay >= 1000ms.</div>
      </div>

      <OpenedTradesList trades={openedTrades} />


      <button
        type="button" 
        disabled={run}
        className="btn btn-primary" 
        onClick={ handleStart }
      > START </button>

      <ErrorModal 
        show={showError} 
        title="Error!"
        text="Connection lost. Please try to connect to MetaTrader again."
        handleClose={() => setShowError(false)}
      />

      <button 
        type="button" 
        className="btn btn-primary" 
        onClick={ handleStop }
        disabled={!run}
      > STOP </button>

      <Link className="App-link" href="/home">
        <button className="btn btn-primary btn-lg" disabled={run}>Home</button>
      </Link>
    </Layout>
  )
}

export default RunStrategy
