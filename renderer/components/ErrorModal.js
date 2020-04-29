import React, { useEffect } from 'react'
import {Button, Modal} from 'react-bootstrap'

///
/// ErrorModal displays error
///
const ErrorModal = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{ props.title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{ props.text }</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ErrorModal