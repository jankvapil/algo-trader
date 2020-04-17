import React from 'react'

import Layout from '../components/Layout'
import ConnectionForm from '../components/ConnectionForm'

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
      <ConnectionForm />
    </Layout>
  )
}

export default Home
