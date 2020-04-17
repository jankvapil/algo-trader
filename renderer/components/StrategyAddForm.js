import React, { useState } from 'react';
import useGlobal from "../store"

///
/// StrategyAddForm component creates new trading Strategies
///
const StrategyAddForm = (props) => {
  
  const [globalState, globalActions] = useGlobal();

  // GUI
  const [idInputClass, setIdInputClass] = useState("form-control")

  // Logic
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


  ///
  /// StopLoss input: handle onChange event
  ///
  const handleStopLossChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setStopLoss(1)
    } else setStopLoss(value)
  }
  

  ///
  /// TakeProfit input: handle onChange event
  ///
  const handleTakeProfitChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setTakeProfit(1)
    } else setTakeProfit(value)
  }


  ///
  /// LotSize input: handle onChange event
  ///
  const handleLotSizeChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setLotSize(1)
    } else setLotSize(value)
  }


  ///
  /// Add Strategy button: handle onClick event
  ///
  const handleBtnClick = () => {

    const createStrategy = require('../core/helpers/strategyHelper').createStrategy
    const defineStrategy = require('../core/helpers/strategyHelper').defineStrategy
    
    const usedIndicators = globalState.indicators
    const client = globalState.client
    const symbol = globalState.symbol
    
    // check if the Strategys are identified uniquely  
    const isTuple = globalState.strategies.find(s => s.id == id)
    
    if (isTuple) {
      setIdInputClass("form-control is-invalid")
    } else {
      console.log(`Creating ${id}`)

      // Create new strategy
      const s = createStrategy(
        usedIndicators,
        client, 
        symbol,
        {
          id: id,
          stopLoss: stopLoss,
          takeProfit: takeProfit,
          buyPredicate: buyPredicate,
          sellPredicate: sellPredicate
        }
      )

      console.log(s)

      // Define transitions
      defineStrategy(s, sellPredicate, buyPredicate)

      // Add strategy to global scope
      globalState.strategies.push(s)
    }
  }


  return (
    <div className="form-group has-danger">
      
      <h2 className="display-5">Create Strategy: </h2>
      <label className="col-form-label">Name (id):</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className={idInputClass}
        placeholder="Strategy ID" 
        value={id}
        onChange={handleIdChange} 
      />
      <div className="invalid-feedback">Sorry, this id is already used.</div>

      <label className="col-form-label">StopLoss (pips):</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control"
        placeholder="StopLoss" 
        value={stopLoss}
        onChange={handleStopLossChange}
      />
      
      <label className="col-form-label">TakeProfit (pips):</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control"
        placeholder="TakeProfit" 
        value={takeProfit}
        onChange={handleTakeProfitChange}
      />

      <label className="col-form-label">LotSize:</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control"
        placeholder="LotSize" 
        value={lotSize}
        onChange={handleLotSizeChange}
      />
      
      <label className="col-form-label">BuyPredicate:</label>
      <textarea 
        rows="3"
        type="text"
        style={{width: 600}} 
        className="form-control"
        placeholder="BuyPredicate" 
        value={buyPredicate}
        onChange={(e) => setBuyPredicate(e.target.value)}
      />

      <label className="col-form-label">SellPredicate:</label>
      <textarea 
        rows="3"
        type="text"
        style={{width: 600}} 
        className="form-control"
        placeholder="SellPredicate" 
        value={sellPredicate}
        onChange={(e) => setSellPredicate(e.target.value)}
      />
      
      <button className="btn btn-primary btn-lg" onClick={handleBtnClick}>Create</button>
    </div>
  )
}

export default StrategyAddForm