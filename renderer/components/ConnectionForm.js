import React from 'react';
import Head from 'next/head';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


import { Link } from '../router';

const ConnectionForm = (props) => {
  return (
    <form>
      <TextField id="standard-basic" label="ReqPort" />
      <TextField id="standard-basic" label="PullPort" />
    </form>
  )
}

export default ConnectionForm