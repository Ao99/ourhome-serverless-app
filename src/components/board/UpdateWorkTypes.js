import { useState } from 'react';
import { Modal, Alert, Container, Row, Col, Button } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { updateWorkTypes } from '../../services/WorkTypeService.js';

export function AddWorkType(props) {
  const [newWorkType, setNewWorkType] = useState('');

  async function addWorkType() {
    props.workTypes.push(newWorkType);
    await updateWorkTypes(props.workTypes);
    props.setShowAdd(false);
    setNewWorkType('');
    props.fetchWorkTypes();
  }
  
  return (
    <Modal show={props.showAdd} onHide={() => props.setShowAdd(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add a work type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          onChange={e => setNewWorkType(e.target.value)}
          placeholder="Work type"
          value={newWorkType}
        />
      </Modal.Body>
      <Modal.Footer>
        <Container fluid>
          <Row>
            <Col>
              <Button size="lg" block variant="secondary" onClick={() => props.setShowAdd(false)}>Close</Button>
            </Col>
            <Col>
              <Button size="lg" block variant="success" onClick={addWorkType}>Add</Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}

export function DelWorkType(props) {
  const [show, setShow] = useState(false);

  async function deleteWorkType() {
    var username = (await Auth.currentAuthenticatedUser()).username;
    if(username === 'test'){
      setShow(true);
    } else {
      props.workTypes.splice(props.workTypeIdx, 1);
      await updateWorkTypes(props.workTypes);
      props.setShowDel(false);
      props.fetchWorkTypes();
    }
  }
  
  return (
    <Modal show={props.showDel} onHide={() => props.setShowDel(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete a work type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Do you want to delete the work type "{props.workTypes[props.workTypeIdx]}"?</p>
        {
          show ? <Alert variant="warning" onClose={() => setShow(false)} dismissible>
                      The test user cannot delete a work type!
                    </Alert>
                  : null
        }
      </Modal.Body>
      <Modal.Footer>
        <Container fluid>
          <Row>
            <Col>
              <Button size="lg" block variant="secondary" onClick={() => props.setShowDel(false)}>Close</Button>
            </Col>
            <Col>
              <Button size="lg" block variant="danger" onClick={deleteWorkType}>Delete</Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}