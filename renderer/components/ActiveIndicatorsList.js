import React from 'react'

const ActiveIndicatorsList = (props) => {

  let tbody = <tbody></tbody>

  if (props.indicators.length > 0) {
    tbody = <tbody>
              { props.indicators.map(i => (
                <tr key={ i.name }>
                  <td>{ i.name }</td>
                  <td>{ i.timeframe }</td>
                  <td>{ i.type }</td> 
                </tr>
              )) }        
            </tbody>
  }

  return (
    <div>
      <h3> Active Indicators: </h3>
      <p> The only indicators you can use in your strategy design: </p>
      <table className="table table-hover" style={{width: 500, margin: 'auto'}}>
        <thead>
          <tr>
            <th scope="col"> Name (id) </th>
            <th scope="col"> Timeframe </th>
            <th scope="col"> Type </th>
          </tr>
        </thead>
          { tbody }
      </table> 
    </div>
  )
}

export default ActiveIndicatorsList
