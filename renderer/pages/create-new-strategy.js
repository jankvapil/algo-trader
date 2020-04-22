import React from 'react'

import Layout from '../components/Layout'

import IndicatorAddForm from '../components/IndicatorAddForm'
import StrategyAddForm from '../components/StrategyAddForm'
import ActiveIndicatorsList from '../components/ActiveIndicatorsList'

import useGlobal from "../store"

const CreateNewStrategy = () => {

  const [globalState, globalActions] = useGlobal();

  return (
    <Layout>
      <h2>Create New Strategy</h2>
      <p className="lead">This page shows after connecting to MetaTrader.</p>
      <hr className="my-4"/>
      <IndicatorAddForm />
      <ActiveIndicatorsList indicators={globalState.indicators} />
      <StrategyAddForm />
    </Layout>
  )
}

export default CreateNewStrategy
