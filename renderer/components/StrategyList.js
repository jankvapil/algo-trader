import React, { useState } from 'react'

import StrategyDetail from './StrategyDetail'

import useGlobal from "../store"

///
/// StrategyList component creates new trading Strategies
///
const StrategyList = () => {

  const [globalState, globalActions] = useGlobal();

  ////// GUI
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => { 
    setShow(true);
  }

  ////// Data
  const [selectedStrategy, setSelectedStrategy] = useState(null)

  //////////////////////////////////////////////////////////

  ///
  /// onClick: open modal window with strategy detail
  ///
  const selectStrategy = (e) => {

    const id = e.target.innerHTML
    console.log(`selecting strategy ${id}..`)

    const strat = globalState.strategies.find(s => s.id == id);
    setSelectedStrategy(strat)

    handleShow(true)
  }

  //////////////////////////////////////////////////////////

  ///
  /// onClick: delete strategy by id
  ///
  const deleteStrategy = (id) => {
    const deleteStrategyFromFile = require("../core/helpers/fileHelper").deleteStrategyFromFile
    const filtered = deleteStrategyFromFile(id)
    globalActions.setStrategies(filtered)
  } 

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  let Detail = <div></div>

  if (selectedStrategy) {
    Detail = <StrategyDetail show={show} strategy={selectedStrategy} handleClose={handleClose}/>
  }

  return (
    <div>
      { Detail }

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Created</th>
            <th scope="col">ID</th>
            <th scope="col">SL</th>
            <th scope="col">TP</th>
            <th scope="col">Lot Size</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          { globalState.strategies.map(s => (
              <tr key={s.id}>
                <td>{ s.createdAt }</td>
                <td style={{cursor: "pointer"}}>
                  <a onClick={selectStrategy}>{ s.id }</a></td>
                <td>{ s.strategy.sl }</td>
                <td>{ s.strategy.tp }</td>
                <td>{ s.strategy.lotSize }</td>
                <td>
                  <button onClick={() => deleteStrategy( s.id )} className="ml-2 mb-1 close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </td>
              </tr> 
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default StrategyList