import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const apiName = 'ourhomeApi';
const initialFormState = { date: '', workType: '' };

function App() {
  const [works, setWorks] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchWorks();
  }, []);

  async function fetchWorks() {
    var response = await API.get(apiName, `/work/all`, {})
      .catch(err => {
        console.log(err);
      });
    console.log( response ? response.Items : [] );
    setWorks(response ? response.Items : []);
  }

  async function createWork() {
    if (!formData.date || !formData.workType) return;
    await API.post(apiName, `/work/${formData.date}`, {
      body: {
        workType: formData.workType,
      }
    }).then(() => {
      fetchWorks();
      // setFormData(initialFormState);
    }).catch(err => {
      console.log(err);
    });
  }

  async function deleteWork(work, workType) {
    await API.del(apiName, `/work/${work.date}`, {
      body: {
        workType: workType,
      }
    }).then(() => {
      fetchWorks();
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="App">
      <h1>My Works App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'date': e.target.value})}
        placeholder="Date"
        value={formData.date}
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
            <div key={work.date}>
              <div>
                {
                  Object.keys(work).map(key => (
                    <span key={key}>
                      {key} {work[key]}
                      <button onClick={() => deleteWork(work, key)}>Delete work</button>
                    </span>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);