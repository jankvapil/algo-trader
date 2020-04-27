import React from 'react'
import Head from 'next/head'

// // default styles
// import css from '../styles.css'

const Layout = (props) => {

  return (
    <div>
      <Head>
        <title>MetaTrader4 Client</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/slate/bootstrap.min.css" />
 
      </Head>
      <div className="jumbotron">
        { props.children }
      </div>
    </div>
  )
}

export default Layout