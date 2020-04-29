// @ts-check

import React, { useState } from 'react';
import useGlobal from "../store"

import { Link } from '../router'

const SH = require('../core/helpers/strategyHelper')
const FH = require('../core/helpers/formatHelper')
const fs = require('fs').promises

///
/// StrategyAddForm component creates new trading Strategies
///
const StrategyAddForm = () => {
  
  const [globalState, globalActions] = useGlobal();

  ////// GUI
  //
  // informs user if he creates duplicate strategy
  const [idInputClass, setIdInputClass] = useState("form-control")

  // informs user that predicate has wrong format
  const [predInputClass, setPredInputClass] = useState("form-control")

  // check-input for saving strategy
  const [checked, setChecked] = useState(false)

  // initially disabled button which redirects user to trading page 
  const [disabledStart, setDisabledStart] = useState(true)
  const [disabledCreate, setDisabledCreate] = useState(false)

  ////// DATA
  const [id, setId] = useState('my-strategy')
  const [stopLoss, setStopLoss] = useState(10)
  const [takeProfit, setTakeProfit] = useState(10)
  const [lotSize, setLotSize] = useState(0.01)
  const [buyPredicate, setBuyPredicate] = useState(`price < indicators.get("ma10")`)
  const [sellPredicate, setSellPredicate] = useState(`price >= indicators.get("ma10")`)

  ///
  /// Id input: handle onChange event
  ///
  const handleIdChange = (e) => {
    setIdInputClass("form-control")
    setId(e.target.value)
  }

  //////////////////////////////////////////////////////////

  ///
  /// StopLoss input: handle onChange event
  ///
  const handleStopLossChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setStopLoss(1)
    } else setStopLoss(value)
  }
  
  //////////////////////////////////////////////////////////

  ///
  /// TakeProfit input: handle onChange event
  ///
  const handleTakeProfitChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setTakeProfit(1)
    } else setTakeProfit(value)
  }

  //////////////////////////////////////////////////////////

  ///
  /// LotSize input: handle onChange event
  ///
  const handleLotSizeChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setLotSize(1)
    } else setLotSize(value)
  }

  //////////////////////////////////////////////////////////

  ///
  /// Add Strategy button: handle onClick event
  ///
  const handleBtnClick = async () => {
    
    // uninitialized indicators
    const usedIndicators = globalState.indicators

    const client = globalState.client
    const symbol = globalState.symbol
    
    // In this app-version is only 1 strategy allowed to trade at once

    // // check if the Strategys are identified uniquely  
    // const isTuple = globalState.strategies.find(s => s.id == id)

    // if (isTuple) {
    //   setIdInputClass("form-control is-invalid")
    // } else {
  
    console.log(`Creating ${id}`)

    // Create new strategy with uninitialized indicators
    const s = SH.createStrategy(
      usedIndicators,
      client, 
      symbol,
      {
        id: id,
        stopLoss: stopLoss,
        takeProfit: takeProfit,
        lotSize: lotSize,
        buyPredicate: buyPredicate,
        sellPredicate: sellPredicate
      }
    )

    console.log(s)

    
    // Try define strategy, eval transitions
    try {
      SH.defineStrategy(s, sellPredicate, buyPredicate)
      
      // save to file?
      if (checked) {
        const isSaved = await saveStrategy()
        if (!isSaved) {
          console.error("Not Saved!")
          return
        }
        console.log("Saved!")
      }

      // set active strategy to global scope
      globalActions.setActiveStrategy([s])
      
      setDisabledCreate(true)
      setDisabledStart(false)
    } catch (e) {
      console.error(e)
      setPredInputClass("form-control is-invalid")
    }
  }

  //////////////////////////////////////////////////////////

  ///
  /// Saves strategy to JSON file
  ///
  const saveStrategy = async () => {
      
    console.log("Saving strat...")
    
    const usedIndicators = globalState.indicators

    const savedStrat = {
      id: id,
      createdAt: FH.getNowDateFormated(),
      indicators: usedIndicators,
      strategy: {
        sl: stopLoss,
        tp: takeProfit,
        lotSize: lotSize,
        sellPredicate: sellPredicate,
        buyPredicate: buyPredicate
      }
    }

    let successfullySaved = false

    const res = fs.readFile('./strategies.json', 'utf8')

    const json = await res.then(
      (data) => { return JSON.parse(data) }
    ).catch(
      (err) => console.error("File read failed:", err)
    )

    if (json) {
      // check if the strategies are identified uniquely  
      const isTuple = json.find(s => s.id == id)

      if (isTuple) {
        setIdInputClass("form-control is-invalid")
      } else {
        json.push(savedStrat)
        const str = JSON.stringify(json, null, 2)
        const writeRes = fs.writeFile("strategies.json", str, "utf8")
        
        successfullySaved = await writeRes.then(
          () => { return true }
        ).catch(
          (err) => {
            console.error("File read failed:", err)
            return false
          }
        )

        if (successfullySaved) {
          globalActions.setStrategies(json)
        }
      }
    } 

    return successfullySaved;
  }

  //////////////////////////////////////////////////////////

  ///
  /// BuyPredicate handle onChange event
  ///
  const handleBuyPredicateChange = (e) => { 
    setPredInputClass("form-control")
    setBuyPredicate(e.target.value)
  }

  //////////////////////////////////////////////////////////

  ///
  /// SellPredicate handle onChange event
  ///
  const handleSellPredicateChange = (e) => { 
    setPredInputClass("form-control")
    setSellPredicate(e.target.value)
  }

  //////////////////////////////////////////////////////////

  ///
  /// Cleanup function after leaving strategy-add form
  ///
  const clearIndicators = () => {
    globalActions.setIndicators([])
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  return (
    <div className="form-group has-danger">
      
      <h2 className="display-5">Create Strategy: </h2>
      <label className="col-form-label">Unique Name (ID):</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className={idInputClass}
        placeholder="Strategy ID" 
        value={id}
        onChange={handleIdChange} 
      />
      <div className="invalid-feedback">Sorry, this id is already used.</div>

      <label className="col-form-label">Stop Loss (pips):</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control"
        placeholder="StopLoss" 
        value={stopLoss}
        onChange={handleStopLossChange}
      />
      
      <label className="col-form-label">Take Profit (pips):</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control"
        placeholder="TakeProfit" 
        value={takeProfit}
        onChange={handleTakeProfitChange}
      />

      <label className="col-form-label">Lot Size:</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control"
        placeholder="LotSize" 
        value={lotSize}
        onChange={handleLotSizeChange}
      />
      
      <label className="col-form-label">Buy Predicate:</label>
      <textarea 
        rows="3"
        type="text"
        style={{width: 600}} 
        className={predInputClass}
        placeholder="BuyPredicate" 
        value={buyPredicate}
        onChange={handleBuyPredicateChange}
      />
      <div className="invalid-feedback">Please set valid predicate. </div>

      <label className="col-form-label">Sell Predicate:</label>
      <textarea
        rows="3"
        type="text"
        style={{width: 600}} 
        className={predInputClass}
        placeholder="SellPredicate" 
        value={sellPredicate}
        onChange={handleSellPredicateChange}
      />
      <div className="invalid-feedback">Please set valid predicate. </div>
      
      <div className="custom-control custom-checkbox">
        <input 
          type="checkbox" 
          className="custom-control-input" 
          id="stratSaveCheck" 
          checked={checked} 
          onChange={(e) => setChecked(!checked)}
        />
        
        <hr className="my-1" />
        <label className="custom-control-label" htmlFor="stratSaveCheck">Save strategy?</label>
      </div>

      <hr className="my-2" />

      <Link className="App-link" href="/connected">
        <button type="button" className="btn btn-primary" onClick={clearIndicators}>Back</button>
      </Link>
      <button 
        className="btn btn-primary btn-lg" 
        onClick={handleBtnClick}
        disabled={disabledCreate}
      >Create</button>
      
      <Link className="App-link" href="/run-strategy">
        <button className="btn btn-primary btn-lg" disabled={disabledStart}>Start Trading</button>
      </Link>
    </div>
  )
}

export default StrategyAddForm