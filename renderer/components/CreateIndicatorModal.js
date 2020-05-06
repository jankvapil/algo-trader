import React from 'react'
import {Button, Modal} from 'react-bootstrap'

import IndicatorAddForm from './IndicatorAddForm'

///
/// CreateIndicatorModal component shows modal window with indicator definition
///
const CreateIndicatorModal = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{margin: 'auto'}}>
          <IndicatorAddForm />
        </Modal.Body>
        <Modal.Footer>
          <Button style={{fontSize: 16, width: 100}} onClick={props.handleClose}>
            Back
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateIndicatorModal