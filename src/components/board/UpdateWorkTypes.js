import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { updateOneSetting } from '../../services/SettingService.js';

export function AddWorkType(props) {
  const [newWorkType, setNewWorkType] = useState('');
  async function addWorkType() {
    if (!props.isSignedin) return;
    props.workTypes.push(newWorkType);
    await updateOneSetting('workTypes', props.workTypes, true);
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
        <p>Name of the new work type:</p>
        <input
          onChange={e => setNewWorkType(e.target.value)}
          placeholder="Work type"
          value={newWorkType}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.setShowAdd(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={addWorkType}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function DelWorkType(props) {
  async function deleteWorkType() {
    if (!props.isSignedin) return;
    props.workTypes.splice(props.workTypeIdx, 1);
    await updateOneSetting('workTypes', props.workTypes, true);
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
        <Button variant="secondary" onClick={() => props.setShowDel(false)}>
          Close
        </Button>
        <Button variant="danger" onClick={deleteWorkType}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}