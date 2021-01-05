import { useState, useEffect, useRef } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import './Board.css';
import Ripple from '../ripple/Ripple.js';
import { getSettingsByType, updateOneSetting } from '../../services/SettingService.js';
import { getWorksByMonth, updateOneWork } from '../../services/WorkService.js';

function Board(props) {
  const numDays = new Date(props.year, props.month, 0).getDate();
  const array31Days = Array.from({length: 31}, (_, i) => {return {day: i + 1}});

  const tBodyRef = useRef(null);

  const [yearMonth, setYearMonth] = useState('' + props.year + (props.month < 10 ? '0' : '') + props.month);
  const [workTypes, setWorkTypes] = useState([]);
  const [works, setWorks] = useState(array31Days);
  const [showAdd, setShowAdd] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [workTypeIdx, setWorkTypeIdx] = useState(-1);
  const [formData, setFormData] = useState({'workType': ''});
  
  useEffect(() => {
    setYearMonth('' + props.year + (props.month < 10 ? '0' : '') + props.month);
    scrollTo(props.day);
    console.log(JSON.stringify(props));
  }, [props]);
  
  useEffect(() => {
    fetchWorkTypes();
  }, []);
  
  useEffect(() => {
    fetchWorks(yearMonth, numDays);
  }, [yearMonth, numDays]);
  
  function scrollTo(day) {
    if(day > numDays-2) day = numDays-2;
    var tableBody = tBodyRef.current;
    console.log(day);
    tableBody.childNodes[day+1].scrollIntoView({behavior: 'smooth', block: 'center'});
  }
  
  /*
   * start of workType
   */
  async function fetchWorkTypes() {
    try {
      var allWorkTypes = (await getSettingsByType('workTypes')).Items[0].allUsers;
      setWorkTypes(allWorkTypes);
    } catch(err) {
      setWorkTypes([]);
    }
  }
  
  async function addWorkType() {
    if (!props.isSignedin) return;
    workTypes.push(formData.workType);
    await updateOneSetting('workTypes', workTypes, true);
    setShowAdd(false);
    setFormData({ ...formData, 'workType': '' });
    fetchWorkTypes({});
  }
  
  async function deleteWorkType() {
    if (!props.isSignedin) return;
    workTypes.splice(workTypeIdx, 1);
    await updateOneSetting('workTypes', workTypes, true);
    setShowDel(false);
    fetchWorkTypes();
  }
  
  const handleShowAdd = () => setShowAdd(true);
  
  const handleCloseAdd = () => setShowAdd(false);
  
  const handleShowDel = (index) => {
    setWorkTypeIdx(index);
    setShowDel(true);
  };
  
  const handleCloseDel = () => setShowDel(false);
  // end of workType
   
  /*
   * start of work
   */
  async function fetchWorks(yearMonth, numDays) {
    try {
      var works = (await getWorksByMonth(yearMonth)).Items;
      
      // DB may only contains records for some days, e.g. day 1, 3, 7, 8, 11, ...
      // fill the missing days with empty work
      var worksFullMonth = [];
      for(var i=0, j=0; i<numDays; i++){
        if(j < works.length && works[j].day === i + 1) {
          worksFullMonth.push(works[j]);
          j++;
        } else {
          worksFullMonth.push({ day: i+1 });
        }
      }
      setWorks(worksFullMonth);
    } catch(err) {
      setWorks([]);
    }
  }
  
  async function updateWork(day, workType) {
    if (!props.isSignedin) return;
    await updateOneWork(yearMonth, day, workType);
    fetchWorks(yearMonth, numDays);
  }
  // end of work
  
  return (
    <div>
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add a work type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Name of the new work type:</p>
          <input
            onChange={e => setFormData({ ...formData, 'workType': e.target.value })}
            placeholder="Work type"
            value={formData.workType}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={addWorkType}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showDel} onHide={handleCloseDel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete a work type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to delete the work type "{workTypes[workTypeIdx]}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDel}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteWorkType}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Table responsive striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Date</th>
            {
              workTypes.map((workType, index) => (
                <Ripple customTag="th" className="filled" key={workType} onClick={() => handleShowDel(index)}>
                  {workType}
                </Ripple>
              ))
            }
            <th>
              <Button variant="outline-success" onClick={handleShowAdd}>+</Button>
            </th>
          </tr>
        </thead>
        <tbody id="tbody" ref={tBodyRef}>
          {
            works.map(work => (
              <tr key={work.day} >
                <td>{props.year}-{props.month}-{work.day}</td>
                {
                  workTypes.map(workType => (
                    <Ripple customTag="td" className={work[workType] ? "filled" : "empty"} key={workType} onClick={() => updateWork(work.day, workType)}>
                      {work[workType] ? work[workType].map(username => username + ' ') : ''}
                    </Ripple>
                  ))
                }
                <td></td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  );
}

export default Board;