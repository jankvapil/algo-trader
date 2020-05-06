import React, { useState } from 'react'

import Layout from '../components/Layout'

import StrategyAddForm from '../components/StrategyAddForm'
import ActiveIndicatorsList from '../components/ActiveIndicatorsList'
import CreateIndicatorModal from '../components/CreateIndicatorModal'

import useGlobal from "../store"

const CreateNewStrategy = () => {

  const [globalState, globalActions] = useGlobal();

  /// GUI
  const [showAddIndicator, setShowAddIndicator] = useState(false)

  return (
    <Layout>
      <h2 className="display-3"> Create Strategy </h2>
      <p className="lead"> Define your own indicators and strategy. </p>
      <hr className="my-4"/>

      <CreateIndicatorModal
        title={ "Create New Indicator" }
        show={ showAddIndicator }
        handleClose={() => setShowAddIndicator(false)}
      />

      <ActiveIndicatorsList indicators={globalState.indicators} />
      <hr className="my-3"/>
      
      <button 
        className="btn btn-primary btn-lg" 
        style={{width: 200, height: 50, fontSize: 16}}
        type="submit"
        onClick={() => setShowAddIndicator(true)}
      > Add Indicator </button>

      <hr className="my-4"/>

      <StrategyAddForm />
    </Layout>
  )
}

export default CreateNewStrategy
