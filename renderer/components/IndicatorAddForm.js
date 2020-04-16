import React, { useState } from 'react';
import useGlobal from "../store"

///
/// IndicatorAddForm component creates new indicators used by strategies
///
const IndicatorAddForm = (props) => {
  
  const [globalState, globalActions] = useGlobal();

  // GUI
  const [idClass, setIdClass] = useState("form-control")

  // Logic
  const [id, setId] = useState('ma10')
  const [timeframe, setTimeframe] = useState(10)
  const [type, setType] = useState("Moving Average")


  ///
  /// Timeframe: handle input:onChange event
  ///
  const handleTimeframeChange = (e) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value < 1) {
      setTimeframe(1)
    } else setTimeframe(value)
  }

  const handleIdChange = (e) => {
    setIdClass("form-control")
    setId(e.target.value)
  }

  ///
  /// AddBtn: handle btn:onClick event
  ///
  const add = () => {

    // check if the indicators are identified uniquely  
    const isTuple = globalState.indicators.find(i => i.id == id)

    if (isTuple) {
      setIdClass("form-control is-invalid")
    } else {
      globalState.indicators.push({
        id: id,
        timeframe: timeframe,
        type: type
      })
    }

    console.log(globalState.indicators)
    
    // const fs = require('fs')
    // const str = JSON.stringify(indicator, null, 2)
    // fs.writeFile("strategies.json", str, "utf8", () =>
    //   console.log("saving file..")
    // )
  }

  return (
    <div className="form-group has-danger">
      
      <h2 className="display-5">Create Indicator: </h2>
      <label className="col-form-label">Name (id):</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className={idClass}
        placeholder="Indicator ID" 
        value={id}
        onChange={handleIdChange} 
      />
      <div className="invalid-feedback">Sorry, that id is already used.</div>

      <label className="col-form-label">TimeFrame:</label>
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

      <button className="btn btn-primary btn-lg" onClick={add}>Add</button>
 
    </div>
    
  )
}

export default IndicatorAddForm