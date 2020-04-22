// @ts-check

import React from 'react'

const OpenedTradesList = (props) => {

  let tbody = <tbody></tbody>

  if (props.trades.length > 0) {
    tbody = <tbody>
              { props.trades.map(t => (
                <tr key={ t.ticket }>
                  <td>{ t.ticket }</td>
                  <td>{ t.lots }</td>
                  <td>{ t.pnl }</td> 
                </tr>
              )) }        
            </tbody>
  }

  return (
    <div>
      <h3>Active trades list</h3>
      <p>The only trades you can use in your strategy design:</p>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Ticket</th>
            <th scope="col">Lots</th>
            <th scope="col">Profit</th>
          </tr>
        </thead>
          { tbody }
      </table> 
    </div>
  )
}

export default OpenedTradesList
