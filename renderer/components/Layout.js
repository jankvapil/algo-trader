import React from 'react'
import Head from 'next/head'

// // default styles
// import css from '../styles.css'

const Layout = (props) => {

  const styles = {
    // float: 'left',
    width: '100%',
    alignItems: 'center',
    paddingRight: '20%',
    paddingLeft: '20%',
    margin: 'auto'
  }

  return (
    <div>
      <Head>
        <title>MetaTrader4 Client</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/slate/bootstrap.min.css" />
 
      </Head>
      <div className="jumbotron text-center items-center" style={styles}>
        { props.children }
      </div>

      <footer className="page-footer font-small unique-color-dark pt-4">
      <div className="container">
        <ul className="list-unstyled list-inline text-center py-2">
          <li className="list-inline-item">
            <h5 className="mb-1">Bachelor Thesis</h5>
            <p>Created by
              <br />
              <i>jkvapil6@gmail.com</i>
            </p>
          </li>
        </ul>
      </div>
    </footer>
    </div>
  )
}

export default Layout