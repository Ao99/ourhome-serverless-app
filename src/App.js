import { useState, useEffect } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
import { Table, Button } from 'react-bootstrap';
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

  useEffect(() => {
    fetchWorkTypes();
  }, []);
  
  useEffect(() => {
    fetchWorks(month);
  }, [month]);
  
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

  async function createWork(day, workType) {
    if (!isSignedin || !day || !workType) return;
    await updateOneWork(month, day, workType);
    fetchWorks(month);
  }

  async function deleteWork(day, workType) {
    if (!isSignedin) return;
    await deleteOneWork(month, day, workType);
    fetchWorks(month);
  }
  
  async function checkUser() {
    Auth.currentAuthenticatedUser()
      .then(user => console.log({ user }))
      .catch(err => console.log(err));
    console.log(await Auth.currentUserInfo());
  }

  function handleAuthStateChange(state) {
    if (state === 'signedIn') {
      setIsSignedin(true);
    } else {
      setIsSignedin(false);
    }
  }

  return (
    <div className="App">
      <Authenticator hideDefault={true} onStateChange={handleAuthStateChange}>
          <SignIn/>
          <SignUp/>
          <ConfirmSignUp/>
          <Greetings/>
      </Authenticator>

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
                <th key={workType}>
                  {workType}
                  <Button variant="outline-danger" onClick={() => deleteWorkType(index)}>Delete</Button>
                </th>
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
                    <td key={workType}>
                      {work[workType]}
                      <Button variant="outline-info" onClick={() => createWork(work.day, workType)}>Create</Button>
                      <Button variant="outline-danger" onClick={() => deleteWork(work.day, workType)}>Delete</Button>
                    </td>
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