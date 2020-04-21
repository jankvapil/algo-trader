// @ts-check

import React, { useState } from 'react';
import useGlobal from "../store"

///
/// IndicatorAddForm component creates new indicators used by strategies
///
const IndicatorAddForm = () => {
  
  const [globalState, globalActions] = useGlobal();

  ///// GUI
  const [idInputClass, setIdInputClass] = useState("form-control")

  ///// DATA
  const [id, setId] = useState('ma10')
  const [timeframe, setTimeframe] = useState(10)
  const [type, setType] = useState("Moving Average")

  //////////////////////////////////////////////////////////

  ///
  /// Timeframe input: handle onChange event
  ///
  const handleTimeframeChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setTimeframe(1)
    } else setTimeframe(value)
  }

  //////////////////////////////////////////////////////////

  ///
  /// Id input: handle onChange event
  ///
  const handleIdChange = (e) => {
    setIdInputClass("form-control")
    setId(e.target.value)
  }

  //////////////////////////////////////////////////////////

  ///
  /// Add Indicator button: handle onClick event
  ///
  const handleBtnClick = () => {
    //
    // check if the indicators are identified uniquely  
    const isTuple = globalState.indicators.find(i => i.name == id)

    // if not - inform user
    if (isTuple) {
      setIdInputClass("form-control is-invalid")
    } else {
      
      // hook the global indicators
      const alreadyDefinedIndicators = globalState.indicators
      
      // create new indicator from input values
      const newIndicator = {
        name: id,
        timeframe: timeframe,
        type: type
      }

      // extend array with new indicator
      alreadyDefinedIndicators.push(newIndicator)

      // set indicators globally
      globalActions.setIndicators(alreadyDefinedIndicators)
    }
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  return (
    <div className="form-group has-danger">
      
      <h2 className="display-5">Create Indicator: </h2>
      <label className="col-form-label">Unique Name (ID):</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className={idInputClass}
        placeholder="Indicator ID" 
        value={id}
        onChange={handleIdChange} 
      />
      <div className="invalid-feedback">Sorry, this id is already used.</div>

      <label className="col-form-label">Time Frame:</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control"
        placeholder="Timeframe" 
        value={timeframe}
        onChange={handleTimeframeChange}
      />
      
      <label className="col-form-label">Indicator:</label>
      <div className="form-group">
        <select 
          className="custom-select" 
          style={{width: 200}}
          onChange={(e) => setType(e.target.value)} 
          defaultValue={type}
        >
          <option value="Moving Average">Moving Average</option>
          <option value="MACD">MACD</option>
          <option value="ZikZak">ZikZak</option>
        </select>
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleBtnClick}>Add</button>
    </div>
  )
}

export default IndicatorAddForm