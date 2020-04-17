import React, { useState } from 'react';
import useGlobal from "../store"

const Indicators = require('../core/Indicators')

///
/// IndicatorAddForm component creates new indicators used by strategies
///
const IndicatorAddForm = (props) => {
  
  const [globalState, globalActions] = useGlobal();

  // GUI
  const [idInputClass, setIdInputClass] = useState("form-control")

  // Logic
  const [id, setId] = useState('ma10')
  const [timeframe, setTimeframe] = useState(10)
  const [type, setType] = useState("Moving Average")


  ///
  /// Timeframe input: handle onChange event
  ///
  const handleTimeframeChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setTimeframe(1)
    } else setTimeframe(value)
  }


  ///
  /// Id input: handle onChange event
  ///
  const handleIdChange = (e) => {
    setIdInputClass("form-control")
    setId(e.target.value)
  }


  ///
  /// Add Indicator button: handle onClick event
  ///
  const handleBtnClick = () => {

    console.log(`Adding indicator ${id} on ${timeframe} sec timeframe and type: ${type}`)

    // check if the indicators are identified uniquely  
    const isTuple = globalState.indicators.find(i => i.id == id)

    if (isTuple) {
      setIdInputClass("form-control is-invalid")
    } else {
      let f
  
      switch(type) {
        case "Moving Average" : f = Indicators.average(timeframe)
          break
        default: throw Error("Undefined indicator!")
      }

      globalState.indicators.push({
        name: id,
        timeframe: timeframe,
        type: type,
        f: f
      })
    }
    
    // const fs = require('fs')
    // const str = JSON.stringify(indicator, null, 2)
    // fs.writeFile("strategies.json", str, "utf8", () =>
    //   console.log("saving file..")
    // )
  }


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