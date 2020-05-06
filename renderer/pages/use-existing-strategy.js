import React, { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import StrategyList from '../components/StrategyList'

import useGlobal from "../store"

import { Link } from '../router'

const fs = require('fs').promises

///
/// UseExistingStrategy component let user to choose from saved strategies
///
const UseExistingStrategy = () => {

  const [globalState, globalActions] = useGlobal();

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

  ///
  /// Cleanup function after leaving strategy-add form
  ///
  const clearIndicators = () => {
    globalActions.setIndicators([])
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  return (
    <Layout>
      <h2 className="display-3"> Use Existing Strategy </h2>
      <p className="lead"> You can select or delete previously defined strategy. </p>
      <hr className="my-4"/>

      <StrategyList/>
      <hr className="my-4"/>
      <Link className="App-link" href="/connected">
        <button 
          style={{width: 100, height: 50}}
          type="button" 
          className="btn btn-primary" 
          onClick={clearIndicators}
        > Back </button>
      </Link>
    </Layout>
  )
}

export default UseExistingStrategy
