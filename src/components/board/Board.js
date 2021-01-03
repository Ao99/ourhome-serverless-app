import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import Ripple from '../ripple/Ripple.js';
import { getSettingsByType, updateOneSetting } from '../../services/SettingService.js';
import { getWorksByMonth, updateOneWork } from '../../services/WorkService.js';

function Board(props) {
  let now = new Date();
  now = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // offset according to time zone
  
  const [month, setMonth] = useState('' + now.getFullYear()
                            + (now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1));
  const [workTypes, setWorkTypes] = useState([]);
  const [works, setWorks] = useState([]);
  const [formData, setFormData] = useState({'workType': ''});

  useEffect(() => {
    fetchWorkTypes();
  }, []);
  
  useEffect(() => {
    fetchWorks(month);
  }, [month]);
  
  async function fetchWorkTypes() {
    var workTypeSetting = (await getSettingsByType('workTypes')).Items[0];
    setWorkTypes(workTypeSetting ? workTypeSetting.allUsers : []);
  }
  
  async function createWorkType() {
    if (!props.isSignedin) return;
    workTypes.push(formData.workType);
    await updateOneSetting('workTypes', workTypes, true);
    fetchWorkTypes();
  }
  
  async function deleteWorkType(index) {
    if (!props.isSignedin) return;
    workTypes.splice(index, 1);
    await updateOneSetting('workTypes', workTypes, true);
    fetchWorkTypes();
  }
  
  async function fetchWorks(month) {
    var res = await getWorksByMonth(month)
    .catch(err => {
      console.log(err);
    });
    setWorks(res && res.Items ? res.Items : []);
  }
  
  async function handleClickWork(work, day, workType) {
    if (!props.isSignedin) return;
    await updateOneWork(month, day, workType);
    fetchWorks(month);
  }
  
  return (
    <div>
      <h1>My Works App</h1>
      
      <div>
        Set month -
        <input
          onChange={e => setMonth(e.target.value)}
          placeholder="Month"
          value={month}
        />
      </div>
      
      <div>
        <input
          onChange={e => setFormData({ ...formData, 'workType': e.target.value})}
          placeholder="Work type"
          value={formData.workType}
        />
        <Button variant="outline-success" onClick={createWorkType}>Create work type</Button>
      </div>
      
      <Table responsive striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Date</th>
            {
              workTypes.map((workType, index) => (
                <Ripple customTag="th" className="filled" key={workType} onClick={() => deleteWorkType(index)}>
                  {workType}
                </Ripple>
              ))
            }
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>
          {
            works.map(work => (
              <tr key={work.day}>
                <td>{month}-{work.day}</td>
                {
                  workTypes.map(workType => (
                    <Ripple customTag="td" className={work[workType] ? "filled" : "empty"} key={workType} onClick={() => handleClickWork(work, work.day, workType)}>
                      {work[workType]}
                    </Ripple>
                  ))
                }
                <td>{work.updatedAt}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  )
}

export default Board;