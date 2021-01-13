import { useState } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
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
              <Button size="lg" block variant="primary" onClick={addWorkType}>Add</Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}

export function DelWorkType(props) {
  async function deleteWorkType() {
    props.workTypes.splice(props.workTypeIdx, 1);
    await updateWorkTypes(props.workTypes);
    props.setShowDel(false);
    props.fetchWorkTypes();
  }
  
  return (
    <Modal show={props.showDel} onHide={() => props.setShowDel(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete a work type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Do you want to delete the work type "{props.workTypes[props.workTypeIdx]}"?</p>
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