import React from 'react'

import Layout from '../components/Layout'

const CreateNewStrategy = () => {

  return (
    <Layout>
      <h1 className="display-3">Create New Strategy</h1>
      <p className="lead">This page shows after connecting to MetaTrader.</p>
      <hr className="my-4"/>
      <p>Select between these two options.</p>
      <button type="button" className="btn btn-primary">Create New Strategy</button>
      <button type="button" className="btn btn-secondary">Use Existing Strategy</button>
    </Layout>
  )
}

export default CreateNewStrategy
