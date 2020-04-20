import React from 'react'

import Layout from '../components/Layout'
import { Link } from '../router'

const Connected = () => {
  return (
    <Layout>
      <h1 className="display-3">Connected</h1>
      <p className="lead">This page shows after connecting to MetaTrader.</p>
      <hr className="my-4"/>
      <p>Select between these two options.</p>
      
      <Link className="App-link" href="/create-new-strategy">
        <button type="button" className="btn btn-primary">Create New Strategy</button>
      </Link>
      
      <Link className="App-link" href="/use-existing-strategy">
        <button type="button" className="btn btn-secondary">Use Existing Strategy</button>
      </Link>
    </Layout>
  )
}

export default Connected
