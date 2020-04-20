import React from 'react'

import Layout from '../components/Layout'

import IndicatorAddForm from '../components/IndicatorAddForm'
import StrategyAddForm from '../components/StrategyAddForm'

import { Link } from '../router'

const CreateNewStrategy = () => {
  return (
    <Layout>
      <h1 className="display-3">Create New Strategy</h1>
      <p className="lead">This page shows after connecting to MetaTrader.</p>
      <hr className="my-4"/>
      <IndicatorAddForm />
      <StrategyAddForm />
    </Layout>
  )
}

export default CreateNewStrategy
