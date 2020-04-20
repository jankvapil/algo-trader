import React, { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import StrategyList from '../components/StrategyList'

import useGlobal from "../store"

import { Link } from '../router'
import { Button } from 'react-bootstrap'

const fs = require('fs').promises

///
/// UseExistingStrategy component let user to choose from saved strategies
///
const UseExistingStrategy = () => {

  const [globalState, globalActions] = useGlobal();

  ////// GUI
  //
  // initially disabled button which redirects user to trading page 
  const [disabledStart, setDisabledStart] = useState(true)

  ////// Data
  //
  // initially disabled button which redirects user to trading page 
  const [strategies, setStrategies] = useState([])

  ///
  /// Loads strategies immediately when component is loaded 
  ///
  useEffect(() => {
    const init = async() => {
      await loadStrats();
    }

    init();    
  }, [])

  //////////////////////////////////////////////////////////

  ///
  /// Function loads saved strategies
  ///
  const loadStrats = async () => {
    console.log("Loading strats..")

    const res = fs.readFile('./strategies.json', 'utf8')

    const strats = await res.then(
      (data) => { return JSON.parse(data) }
    ).catch(
      (err) => console.error("File read failed:", err)
    )

    globalActions.setStrategies(strats)
    // setStrategies(strats)
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  return (
    <Layout>
      <h3>Use Existing Strategy</h3>
      <hr className="my-2"/>

      <StrategyList/>
      <Link className="App-link" href="/connected">
        <button type="button" className="btn btn-primary">Back</button>
      </Link>
    </Layout>
  )
}

export default UseExistingStrategy
