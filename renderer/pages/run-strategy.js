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

  const styles = {
    input: {
      width: 200, 
      margin: 'auto',
    },
    btn: {
      fontSize: 16,
      height: 50,
      width: 150,
    },
  }

  //////////////////////////////////////////////////////////

  return (
    <Layout>
      <h1 className="display-3">Start Trading</h1>
      <p className="lead">This page shows after selecting strategy.</p>


      <label className="col-form-label">Select Symbol</label>
      <div className="form-group">
        <select 
          className="custom-select" 
          style={styles.input}
          onChange={(e) => setSymbol(e.target.value)} 
          defaultValue={symbol}
        >
          <option value="EURUSD">EURUSD</option>
          <option value="USDJPY">USDJPY</option>
          <option value="GBPUSD">GBPUSD</option>
        </select>
      </div>

      <div className="form-group has-danger">
        <label className="col-form-label">Timeframe: (ms)</label>
        <input 
          type="text"
          style={styles.input} 
          className={timeframeInputClass}
          id="inputDefault" 
          value={timeframe}
          onChange={ handleTimeframeChange } />
        <div className="invalid-feedback">Please set timeframe >= 1000ms.</div>
      </div>
      
      <div className="form-group has-danger">
        <label className="col-form-label">Order Delay: (ms)</label>
        <input 
          type="text"
          style={styles.input} 
          className={delayInputClass}
          id="inputDefault" 
          value={tradeDelay}
          onChange={ handleDelayChange } />
        <div className="invalid-feedback">Please set order delay >= 1000ms.</div>
      </div>

      <button
        type="button" 
        style={styles.btn}
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
        style={styles.btn}
        className="btn btn-primary" 
        onClick={ handleStop }
        disabled={!run}
      > STOP </button>

      
      <hr className="my-4"/>
      <Link className="App-link" href="/home">
        <button 
          style={styles.btn}
          className="btn btn-primary btn-lg" 
          disabled={run}
        > Home</button>
      </Link>

      
      <hr className="my-4"/>
      <h3>{ symbol }: { price }</h3>

      <hr className="my-4"/>
      <OpenedTradesList trades={openedTrades} />
    </Layout>
  )
}

export default RunStrategy
