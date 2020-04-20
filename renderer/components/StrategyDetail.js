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
          <Modal.Title>{ props.strategy.id }</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
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