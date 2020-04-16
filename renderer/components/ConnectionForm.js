import React, { useState } from 'react';
import useGlobal from "../store"

///
/// ConnectionForm component creates connection with MetaTrader 
///
const ConnectionForm = (props) => {
  
  const [globalState, globalActions] = useGlobal();

  const [reqPort, setReqPort] = useState(5555)
  const [pullPort, setPullPort] = useState(5556)

  ///
  /// Connection: handle btn onclick event
  ///
  const connect = async () => {
    const Client = require('../core/Client')

    const client = new Client(reqPort, pullPort)
    const res = client.connect()

    // resolve promise
    res.then(
      console.log("Connected!"),
       
      // set client globally 
      globalActions.setClient(client),
      globalActions.setConnected(true)  
    )
  }

  return (
    <div className="form-group">
      
      <h2 className="display-5">Connection: </h2>
      <label className="col-form-label" htmlFor="inputDefault">ReqPort:</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control" 
        placeholder="ReqPort" 
        id="inputDefault"
        value={reqPort}
        onChange={(e) => {setReqPort(e.target.value)}} 
      />
      <label className="col-form-label" htmlFor="inputDefault">PullPort:</label>
      <input 
        style={{width: 200}} 
        type="text" 
        className="form-control"
        placeholder="PullPort" 
        id="inputDefault"
        value={pullPort}
        onChange={(e) => {setPullPort(e.target.value)}}
      />
      <button className="btn btn-primary btn-lg" onClick={connect}>Connect</button>
 
    </div>
  )
}

export default ConnectionForm