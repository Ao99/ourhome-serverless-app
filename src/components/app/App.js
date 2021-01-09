import { useState } from 'react';
import Header from '../header/Header.js';
import MonthPicker from '../month/MonthPicker.js';
import Board from '../board/Board.js';
import './App.css';

function App() {
  let now = new Date();
  now = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // offset according to time zone
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  // const nowDay = 31;
  const nowDay = now.getDate();
  
  const [isSignedin, setIsSignedin] = useState(false);
  const [year, setYear] = useState(nowYear);
  const [month, setMonth] = useState(nowMonth);
  const [day, setDay] = useState(nowDay);
  
  return (
    <div className="App">
      <Header
        isSignedin={isSignedin}
        setIsSignedin={setIsSignedin}
      />
      <MonthPicker
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        setDay={setDay}
      />
      <Board
        isSignedin={isSignedin}
        year={year}
        month={month}
        day={day}
      />
    </div>
  );
}

export default App;