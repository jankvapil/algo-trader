import React, {useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const StrategyDetail = (props) => {
  // const [show, setShow] = useState(props.show);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Strategy Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h5>ID: </h5>
        <data>{ props.strategy.id }</data>

        <h5>Used Indicators:</h5>
          <ul className="list-group">
            { props.strategy.indicators.map(i => (
            <li key={i.name} className="list-group-item d-flex justify-content-between align-items-center">
              { i.name }
            </li>
            ))}
          </ul>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Back
          </Button>
          <Button variant="primary" onClick={props.handleClose}>
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StrategyDetail