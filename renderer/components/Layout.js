import React from 'react'
import Head from 'next/head'

import { Navbar, Nav } from 'react-bootstrap'

// default styles
import css from '../styles.css'
// import "bootswatch/dist/cyborg/bootstrap.min.css"; 

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
// import AppBar from '@material-ui/core/AppBar'
// import Toolbar from '@material-ui/core/Toolbar'
// import Button from '@material-ui/core/Button'

import { makeStyles } from '@material-ui/core/styles'

import { Link } from '../router'

const Layout = (props) => {

  return (
    <div>
      <Head>
        <title>MetaTrader Client</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/slate/bootstrap.min.css" />
 
      </Head>
      <Navbar bg="dark" variant="dark">
        <Nav className="mr-auto">
          
        <Typography gutterBottom>
          <Link className="App-link" href="/home">Home</Link>
          <Link className="App-link" href="/about">About</Link>
          <Link className="App-link" href="/connected">Conn</Link>
          <Link className="App-link" href="/create-new-strategy">Create</Link>
          <Link className="App-link" href="/use-existing-strategy">Use</Link>
        </Typography>
        </Nav>
      </Navbar>
      <div className="jumbotron">
        { props.children }
      </div>
    </div>
  )
}

export default Layout