import { useState, useEffect } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';
import { Table } from 'react-bootstrap';
import { getAllWorks, updateOneWork, deleteOneWork } from './service/WorkService.js';

const initialFormState = { month: '', day: '', workType: '' };

function App() {
  const [isSignedin, setIsSignedin] = useState(false);
  const [works, setWorks] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchWorks();
  }, []);

  useEffect(() => {
    console.log(isSignedin);
  }, [isSignedin]);

  async function fetchWorks() {
    var allWorks = await getAllWorks();
    console.log( allWorks ? allWorks.Items : [] );
    setWorks(allWorks ? allWorks.Items : []);
  }

  async function createWork() {
    if (!isSignedin || !formData.month || !formData.day || !formData.workType) return;
    await updateOneWork(formData.month, formData.day, formData.workType);
    fetchWorks();
  }

  async function deleteWork(month, day, workType) {
    if (!isSignedin) return;
    await deleteOneWork(month, day, workType);
    fetchWorks();
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
    
      <h1>My Works App</h1>
      <button onClick={checkUser}>Check User</button>
      <input
        onChange={e => setFormData({ ...formData, 'month': e.target.value})}
        placeholder="Month"
        value={formData.month}
      />
      <input
        onChange={e => setFormData({ ...formData, 'day': e.target.value})}
        placeholder="Day"
        value={formData.day}
      />
      <input
        onChange={e => setFormData({ ...formData, 'workType': e.target.value})}
        placeholder="Work type"
        value={formData.workType}
      />
      <button onClick={createWork}>Create Work</button>
      <div style={{marginBottom: 30}}>
        {
          works.map(work => (
            <div key={work.day}>
              <div>
                <span>Date: {work.month}-{work.day} |</span>
                {
                  Object.keys(work).filter(key => key !== 'month' && key !== 'day' && key !== 'updatedAt').map(key => (
                    <span key={key}>
                        {key} - {work[key]} 
                      <button onClick={() => deleteWork(work.month, work.day, key)}>Delete</button>
                    </span>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
      
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Month</th>
            <th>Day</th>
            <th>cooking</th>
            <th>recycle</th>
            <th>dishes</th>
          </tr>
        </thead>
        <tbody>
          {
            works.map(work => (
              <tr key={work.day}>
                <td>{work.month}</td>
                <td>{work.day}</td>
                <td>{work.cooking}</td>
                <td>{work.recycle}</td>
                <td>{work.dishes}</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  );
}

export default App;