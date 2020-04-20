import React, { useState } from 'react'

import StrategyDetail from './StrategyDetail'

///
/// StrategyList component creates new trading Strategies
///
const StrategyList = (props) => {

  ////// GUI
  //
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => { 
    setShow(true);
  }

  ////// Data
  //
  const [selectedStrategy, setSelectedStrategy] = useState(null)

  //////////////////////////////////////////////////////////

  const selectStrategy = (e) => {

    const id = e.target.innerHTML
    console.log(`selecting strategy ${id}..`)

    const strat = props.strategies.find(s => s.id == id);
    setSelectedStrategy(strat)

    handleShow(true)
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
          { props.strategies.map(s => (
              <tr key={s.id} onClick={selectStrategy}>
                <td>{ s.createdAt }</td>
                <td style={{cursor: "pointer"}}>{ s.id }</td>
                <td>{ s.strategy.sl }</td>
                <td>{ s.strategy.tp }</td>
                <td>{ s.strategy.lotSize }</td>
                <td> x </td>
              </tr> 
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default StrategyList