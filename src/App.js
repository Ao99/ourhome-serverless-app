import React, { useState, useEffect } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import { Table } from 'react-bootstrap';
import Header from './Header.js';
import getRipple from './Ripple.js';
import { getSettingsByType, updateOneSetting } from './service/SettingService.js';
import { getWorksByMonth, updateOneWork, deleteOneWork } from './service/WorkService.js';

function App() {
  let now = new Date();
  now = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // offset according to time zone
  
  const [isSignedin, setIsSignedin] = useState(false);
  const [month, setMonth] = useState('' + now.getFullYear() + (now.getMonth() + 1));
  const [workTypes, setWorkTypes] = useState([]);
  const [works, setWorks] = useState([]);
  const [formData, setFormData] = useState({'workType': ''});
  const RippleTh = getRipple('th');
  const RippleTd = getRipple('td');

  useEffect(() => {
    fetchWorkTypes();
  }, []);
  
  useEffect(() => {
    fetchWorks(month);
  }, [month]);
  
  function handleAuthStateChange(state) {
    if (state === 'signedIn') {
      setIsSignedin(true);
    } else {
      setIsSignedin(false);
    }
  }
  
  async function fetchWorkTypes() {
    var allWorkTypes = (await getSettingsByType('workTypes')).Items[0].allUsers;
    setWorkTypes(allWorkTypes ? allWorkTypes : []);
  }
  
  async function createWorkType() {
    if (!isSignedin) return;
    var newWorkTypes = [ ...workTypes, formData.workType];
    await updateOneSetting('workTypes', newWorkTypes, true);
    fetchWorkTypes();
  }
  
  async function deleteWorkType(index) {
    if (!isSignedin) return;
    var newWorkTypes = [ ...workTypes];
    newWorkTypes.splice(index, 1);
    await updateOneSetting('workTypes', newWorkTypes, true);
    fetchWorkTypes();
  }
  
  async function fetchWorks(month) {
    var worksByMonth = (await getWorksByMonth(month)).Items;
    setWorks(worksByMonth ? worksByMonth : []);
  }
  
  async function handleClickWork(work, day, workType) {
    if (!isSignedin) return;
    
    if(work[workType]) {
      await deleteOneWork(month, day, workType);
    } else {
      await updateOneWork(month, day, workType);
    }
    
    fetchWorks(month);
  }
  
  async function checkUser() {
    Auth.currentAuthenticatedUser()
      .then(user => console.log({ user }))
      .catch(err => console.log(err));
    console.log(await Auth.currentUserInfo());
  }

  return (
    <div className="App">
      <Header onStateChange={handleAuthStateChange} />
      <button onClick={checkUser}>Check User</button>
      
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
        <button onClick={createWorkType}>Create work type</button>
      </div>
      
      <Table responsive striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Date</th>
            {
              workTypes.map((workType, index) => (
                <RippleTh className="filled" key={workType} onClick={() => deleteWorkType(index)}>
                  {workType}
                </RippleTh>
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
                    <RippleTd className={work[workType] ? "filled" : "empty"} key={workType} onClick={() => handleClickWork(work, work.day, workType)}>
                      {work[workType]}
                    </RippleTd>
                  ))
                }
                <td>{work.updatedAt}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  );
}

export default App;