import { useState } from 'react';
import Header from '../header/Header.js';
import BarChart from '../chart/BarChart.js';
import ColorPicker from '../color/ColorPicker.js';
import MonthPicker from '../month/MonthPicker.js';
import Board from '../board/Board.js';
import Footer from '../footer/Footer.js';
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';

function App() {
  let now = new Date();
  now = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // offset according to time zone
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();
  const array31Days = Array.from({length: 31}, (_, i) => {return {day: i + 1}});

  const [isSignedin, setIsSignedin] = useState(false);
  const [year, setYear] = useState(nowYear);
  const [month, setMonth] = useState(nowMonth);
  const [day, setDay] = useState(nowDay);
  const [works, setWorks] = useState(array31Days);
  const [colors, setColors] = useState({});

  return (
    <div className="App">
      <Header
        isSignedin={isSignedin}
        setIsSignedin={setIsSignedin}
        colors={colors}
        setColors={setColors}
      />
      <BarChart
        works={works}
        colors={colors}
      />
      <Container fluid className="mb-3">
        <Row>
          <Col xs={4}>
            <ColorPicker
              colors={colors}
              setColors={setColors}
            />
          </Col>
          <Col xs={8}>
            <MonthPicker
              year={year}
              setYear={setYear}
              month={month}
              setMonth={setMonth}
              setDay={setDay}
            />
          </Col>
        </Row>
      </Container>
      <Board
        isSignedin={isSignedin}
        year={year}
        month={month}
        day={day}
        works={works}
        setWorks={setWorks}
        colors={colors}
      />
      <Footer/>
    </div>
  );
}

export default App;