import { useState, useEffect } from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { getAllWorks, updateOneWork, deleteOneWork } from './service/WorkService.js';

const initialFormState = { date: '', workType: '' };

function App() {
  const [works, setWorks] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchWorks();
  }, []);

  async function fetchWorks() {
    var allWorks = await getAllWorks();
    console.log( allWorks ? allWorks.Items : [] );
    setWorks(allWorks ? allWorks.Items : []);
  }

  async function createWork() {
    if (!formData.date || !formData.workType) return;
    await updateOneWork(formData.date, formData.workType);
    fetchWorks();
  }

  async function deleteWork(date, workType) {
    await deleteOneWork(date, workType);
    fetchWorks();
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
                <span>Date: {work.date} | </span>
                {
                  Object.keys(work).filter(key => key !== 'date' && key !== 'updatedAt').map(key => (
                    <span key={key}>
                        {key} - {work[key]} 
                      <button onClick={() => deleteWork(work.date, key)}>Delete</button>
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