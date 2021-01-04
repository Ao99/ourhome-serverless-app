import { useState, useEffect, useRef } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import './Board.css';
import Ripple from '../ripple/Ripple.js';
import { getSettingsByType, updateOneSetting } from '../../services/SettingService.js';
import { getWorksByMonth, updateOneWork } from '../../services/WorkService.js';

function Board(props) {
  let now = new Date();
  now = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // offset according to time zone
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const numDays = new Date(year, month, 0).getDate();
  const tBodyRef = useRef(null);
  const array31Days = Array.from({length: 31}, (_, i) => {return {day: i + 1}});

  const [yearMonth, setYearMonth] = useState('' + year + (month < 10 ? '0' : '') + month);
  const [workTypes, setWorkTypes] = useState([]);
  const [works, setWorks] = useState(array31Days);
  const [showAdd, setShowAdd] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [workTypeIdx, setWorkTypeIdx] = useState(-1);
  const [formData, setFormData] = useState({'workType': ''});

  useEffect(() => {
    fetchWorkTypes();
  }, []);
  
  useEffect(() => {
    fetchWorks(yearMonth, numDays);
    scrollTo(day);
  }, [yearMonth, day, numDays]);
  
  function scrollTo(day) {
    if(day < 3) return;
    var tableBody = tBodyRef.current;
    tableBody.childNodes[day-3].scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  
  async function fetchWorkTypes() {
    try {
      var allWorkTypes = (await getSettingsByType('workTypes')).Items[0].allUsers;
      setWorkTypes(allWorkTypes);
    } catch(err) {
      setWorkTypes([]);
    }
  }
  
  async function createWorkType() {
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
    fetchWorkTypes();
  }
  
  async function fetchWorks(yearMonth, numDays) {
    try {
      var worksByYearMonth = (await getWorksByMonth(yearMonth)).Items;

      var modifiedWorks = [];
      for(var i=0, j=0; i<numDays; i++){
        if(j < worksByYearMonth.length && worksByYearMonth[j].day === i + 1) {
          modifiedWorks.push(worksByYearMonth[j]);
          j++;
        } else {
          modifiedWorks.push({ day: i+1 });
        }
      }
      setWorks(modifiedWorks);
    } catch(err) {
      setWorks([]);
    }
  }
  
  const handleCloseAdd = () => setShowAdd(false);
  
  const handleShowAdd = () => setShowAdd(true);
    
  const handleCloseDel = () => setShowDel(false);
  
  const handleShowDel = (index) => {
    setWorkTypeIdx(index);
    setShowDel(true);
  };
  
  async function handleClickWork(work, day, workType) {
    if (!props.isSignedin) return;
    await updateOneWork(yearMonth, day, workType);
    fetchWorks(yearMonth, numDays);
  }

  return (
    <div>
      <h1>My Works App</h1>
      
      <div>
        Set year & month -
        <input
          onChange={e => setYearMonth(e.target.value)}
          placeholder="year & month"
          value={yearMonth}
        />
      </div>
      
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
          <Button variant="primary" onClick={createWorkType}>
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
        <thead className="header">
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
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody id="tbody" ref={tBodyRef}>
          {
            works.map(work => (
              <tr key={work.day} >
                <td>{yearMonth}-{work.day}</td>
                {
                  workTypes.map(workType => (
                    <Ripple customTag="td" className={work[workType] ? "filled" : "empty"} key={workType} onClick={() => handleClickWork(work, work.day, workType)}>
                      {work[workType] ? work[workType].map(username => username + ' ') : ''}
                    </Ripple>
                  ))
                }
                <td></td>
                <td>{work.updatedAt}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  );
}

export default Board;