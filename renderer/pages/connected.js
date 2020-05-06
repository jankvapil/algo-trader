import React from 'react'

import Layout from '../components/Layout'
import { Link } from '../router'

const Connected = () => {
  return (
    <Layout>
      <h2 className="display-3" style={{marginTop: 100}}>Connected!</h2>
      <p className="lead">This page shows after connecting to MetaTrader.</p>
      <hr className="my-4"/>

      <p>Select between these two options.</p>
      
      <Link className="App-link" href="/create-new-strategy">
        <button type="button" className="btn btn-primary">Create New Strategy</button>
      </Link>
      
      <Link className="App-link" href="/use-existing-strategy">
        <button type="button" className="btn btn-primary">Use Existing Strategy</button>
      </Link>
    </Layout>
  )
}

export default Connected
