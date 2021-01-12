import { useState, useEffect, useRef } from 'react';
import { Button, Table } from 'react-bootstrap';
import Ripple from '../ripple/Ripple.js';
import { getAllWorkTypes } from '../../services/WorkTypeService.js';
import { getWorksByMonth, updateOneWork } from '../../services/WorkService.js';
import { AddWorkType, DelWorkType } from './UpdateWorkTypes.js';
import './Board.css';

function Board(props) {
  const yearMonth = '' + props.year + (props.month < 10 ? '0' : '') + props.month;
  const numDays = new Date(props.year, props.month, 0).getDate();

  const tBodyRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [workTypes, setWorkTypes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [workTypeIdx, setWorkTypeIdx] = useState(-1);

  useEffect(() => {
    scrollTo(props.day, numDays);
  }, [props.day, numDays, isScrolled]);
  
  useEffect(() => {
    fetchWorkTypes();
  }, []);
  
  useEffect(() => {
    fetchWorks(yearMonth, numDays, props.setWorks);
  }, [yearMonth, numDays, props.setWorks]);
  
  function scrollTo(day, numDays) {
    if(day > numDays-2) day = numDays-2;
    var tableBody = tBodyRef.current;
    tableBody.childNodes[day+1].scrollIntoView({behavior: 'smooth', block: 'center'});
  }
  
  /*
   * start of workType
   */
  async function fetchWorkTypes() {
      setWorkTypes(await getAllWorkTypes());
  }
  
  function handleShowAdd() {
    if (!props.isSignedin) return;
    setShowAdd(true);
  }
  
  function handleShowDel(index) {
    if (!props.isSignedin) return;
    setWorkTypeIdx(index);
    setShowDel(true);
  }
  // end of workType
   
  /*
   * start of work
   */
  async function fetchWorks(yearMonth, numDays, setWorks) {
    var works = await getWorksByMonth(yearMonth);
    
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
    
    // trigger scrollTo() once
    setIsScrolled(true);
  }
  
  async function updateWork(day, workType) {
    if (!props.isSignedin) return;
    await updateOneWork(yearMonth, day, workType);
    fetchWorks(yearMonth, numDays, props.setWorks);
  }
  // end of work
  
  /*
   * start of color
   */
  function getBgColors(work, workType) {
    var users = work[workType];
    var bgColors = {};

    if(users && users.length > 0) {
      if(users.length > 1) {
        var colors = 'linear-gradient(to right';
        users.forEach(user => {
          colors += (',' + props.colors[user]);
        });
        colors += ')';
      } else {
        colors = props.colors[users[0]];
      }
      bgColors = {background: colors};
    }
    
    return bgColors;
  }
  // end of color

  return (
    <div>
      <AddWorkType
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        workTypes={workTypes}
        setWorkType={setWorkTypes}
        fetchWorkTypes={fetchWorkTypes}
      />
      
      <DelWorkType
        showDel={showDel}
        setShowDel={setShowDel}
        workTypes={workTypes}
        setWorkType={setWorkTypes}
        workTypeIdx={workTypeIdx}
        fetchWorkTypes={fetchWorkTypes}
      />
      
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
            props.works.map(work => (
              <tr key={work.day} >
                <td>{props.month}-{work.day}</td>
                {
                  workTypes.map(workType => (
                    <Ripple
                      customTag="td"
                      className={work[workType] && work[workType].length>0 ? "filled" : "empty"}
                      key={workType}
                      onClick={() => updateWork(work.day, workType)}
                      style={getBgColors(work, workType)}
                    >
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