import React, { useEffect } from 'react'
import {Button, Modal} from 'react-bootstrap'

import { Link } from '../router'
import useGlobal from '../store'

const SH = require('../core/helpers/strategyHelper')

///
/// StrategyDetail component initializes strategy
///
const StrategyDetail = (props) => {

  const [globalState, globalActions] = useGlobal();

  ///
  /// Loads active strategy immediately when component is loaded 
  ///
  useEffect(() => {
    const init = async() => {
      await initIndicsAndStrat();
    }

    init();    
  }, [])

  //////////////////////////////////////////////////////////

  ///
  /// Function initialize strategy
  ///
  const initIndicsAndStrat = async () => {
  
    // uninitialized indicators
    const usedIndicators = globalState.indicators
    console.log(usedIndicators)

    const strat = props.loadedStrat.strategy
    console.log(strat)

    const client = globalState.client
    const symbol = globalState.symbol
    
    // in this app-version is only 1 strategy allowed to trade at once
    console.log(`Creating ${props.loadedStrat.id}`)

    // create new strategy with uninitialized indicators
    const s = SH.createStrategy(
      usedIndicators,
      client, 
      symbol,
      {
        id: props.loadedStrat.id,
        stopLoss: strat.sl,
        takeProfit: strat.tp,
        lotSize: strat.lotSize,
        buyPredicate: strat.buyPredicate,
        sellPredicate: strat.sellPredicate
      }
    )

    console.log(s)

    // define transitions
    SH.defineStrategy(s, strat.sellPredicate, strat.buyPredicate)

    // set active strategy to global scope
    globalActions.setActiveStrategy([s])

    return true
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{ props.loadedStrat.id }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Used Indicators:</h5>
          <ul className="list-group">
            { props.loadedStrat.indicators.map(i => (
            <li key={i.name} className="list-group-item d-flex justify-content-between align-items-center">
              { i.name }
            </li>
            ))}
          </ul>
          <hr className="my-4" />    
          <h5>SELL Predicate:</h5>
            <p> {props.loadedStrat.strategy.sellPredicate }</p>
          <hr className="my-4" />
          <h5>BUY Predicate:</h5>
          <p> {props.loadedStrat.strategy.buyPredicate }</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Back
          </Button>
          <Link className="App-link" href="/run-strategy">
            <Button variant="primary">
              Select
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StrategyDetail