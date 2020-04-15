import React, { useState } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { Link } from '../router';

import Layout from '../components/Layout'

import ConnectionForm from '../components/ConnectionForm'


import useGlobal from "../store"



const Home = () => {
  const [price, setprice] = useState(0)
  const newprice = (price) => setprice(price)  

  const [globalState, globalActions] = useGlobal();

  return (
    <Layout>
      
        <h1 className="display-3">Hello, world!</h1>
        <p className="lead">
          This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.
          { price }
        </p>
        <hr className="my-4" />
        <p>It uses utility classNamees for typography and spacing to space content out within the larger container.</p>
      
          <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
        

      <ConnectionForm />
      <button className="btn btn-primary btn-lg" onClick={() => {
        const Client = require('../core/Client')
        const Orders = require("../core/Orders")

        const client = new Client(5555, 5556)

        console.log(client)
        client.connect()

        globalActions.setClient(` You are connected!`)

        const symbol = "EURUSD"
        const symbolArr = client.setSymbolMonitoring(symbol)

        setInterval(function(){
            // Request for opened trades
            Orders.getOpenedTrades(client)
            Orders.rates(client, symbol)
            const lastPrice = symbolArr[symbolArr.length - 1]

            if (lastPrice)
              newprice(lastPrice.getPrice())

        }, 3000);

      }}>Connect</button>
 
    </Layout>
  );
};

export default Home;
