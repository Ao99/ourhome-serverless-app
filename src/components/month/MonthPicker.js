import { useState, useEffect, useRef } from 'react';
import Picker from 'react-month-picker';
import 'react-month-picker/css/month-picker.css';
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
  
  function MonthBox(props) {
    return (
      <div className="box" onClick={e => props.onClick && props.onClick(e)}>
          <label>{props.value}</label>
      </div>
    );
  }

  function makeText(m) {
    if (m && m.year && m.month) return (m.year + '-' + pickerLang.months[m.month-1]);
    return '?';
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
  
  function handleAMonthDissmis(value) {
  }

  return (
    <div className="list-area" >
      <div className="edit">
        <Picker
          ref={pickAMonth}
          years={years}
          value={mValue}
          lang={pickerLang.months}
          onChange={handleAMonthChange}
          onDismiss={handleAMonthDissmis}
        >
          <MonthBox value={makeText(mValue)} onClick={handleClickMonthBox} />
        </Picker>
      </div>
    </div>
  );
}

export default MonthPicker;