import React, { useEffect } from 'react'

import Layout from '../components/Layout'
import ConnectionForm from '../components/ConnectionForm'

const fs = require('fs').promises

///
/// Homepage 
///
const Home = () => {

  ///
  /// Check if the json file with strategies is initialized
  ///
  useEffect(() => {
    const init = async() => {
      fs.access("./strategies.json", fs.F_OK, (err) => {
        if (err) {
          fs.writeFile("strategies.json", "[]", "utf8", () =>
            console.log("Initializing strategies.json file..")
          )
        }
      })
    }

    init();    
  }, [])

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

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
