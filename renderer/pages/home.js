import React from 'react'

import Layout from '../components/Layout'
import ConnectionForm from '../components/ConnectionForm'

import { Link } from '../router'

///
/// Homepage 
///
const Home = () => {
  return (
    <Layout>
      <h1 className="display-3">Welcome!</h1>
      <p className="lead">
        Make sure that your Metatrader Expert-Advisor is running on the same ports as you are connecting to.
      </p>
      <hr className="my-4" />

      TODO: Redirect after connecting..
      <ConnectionForm />
      <Link className="App-link" href="/connected">Conn</Link>
    </Layout>
  )
}

export default Home
