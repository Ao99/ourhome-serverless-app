import { useState, useEffect, useRef } from 'react';
import Picker from 'react-month-picker';
import { Button } from 'react-bootstrap';
import './MonthPicker.css';

function MonthPicker(props) {
  const years = [];
  for(var i=2020; i<=2030; i++) years.push(i);
  const pickerLang = {
    months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  };
  
  const pickAMonth = useRef(null);
  
  const [mValue, setMValue] = useState({year: 0, month: 0});
  
  useEffect(() => {
    setMValue({year: parseInt(props.year, 10), month: parseInt(props.month, 10)});
  }, [props]);
  
  function makeText(m) {
    if (m && m.year && m.month) return (m.year + '-' + pickerLang.months[m.month-1]);
    return 'N/A';
  }
  
  function handleClickMonthBox(e) {
        pickAMonth.current.show();
  }
  
  function handleAMonthChange(year, month) {
      props.setYear(year);
      props.setMonth(month);
      props.setDay(1);
      pickAMonth.current.dismiss();
  }

  return (
    <div className="list-area edit" >
      <Picker
        ref={pickAMonth}
        years={years}
        value={mValue}
        lang={pickerLang.months}
        onChange={handleAMonthChange}
      >
      </Picker>
      <Button variant="secondary" size="lg" block onClick={handleClickMonthBox}>
        {makeText(mValue)}
      </Button>
    </div>
  );
}

export default MonthPicker;