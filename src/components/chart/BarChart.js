import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

function BarChart(props) {
  const [series, setSeries] = useState([]);
  const [barColors, setBarColors] = useState([]);
  
  useEffect(() => {
    setCountsAndColors(props.works, props.colors);
  }, [props.works, props.colors]);
  
  function setCountsAndColors(works, colors) {
    if(colors.size === 0) return;
    
    var counts = {};
    works.forEach(work => {
      Object.keys(work).forEach(key => {
        if(key !== 'month' && key !== 'day' && key !== 'updatedAt') {
          var users = work[key];
          users.forEach(user => {
            counts[user] = (counts[user] ? counts[user] : 0) + 1;
          });
        }
      });
    });
    
    var series = [];
    Object.keys(counts).forEach(user => {
      series.push({
        name: user,
        data: [counts[user]],
        color: colors[user]
      });
    });
    series.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    
    setSeries(series);
    
    var barColors = [];
    series.forEach(e => {
      barColors.push(e['color']);
    });

    setBarColors(barColors);
  }
    
  var options = {
    chart: {
      stacked: true,
      stackType: '100%',
      toolbar: { show: false }
    },
    theme: { mode: 'dark' },
    colors: barColors,
    plotOptions: {
      bar: { horizontal: true, barHeight: '100%' }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    grid: { show: false },
    xaxis: {
      categories: ['Work count'],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { show: false },
    dataLabels: {
      style: { fontSize: '1rem' }
    },
    tooltip: {
      style: { fontSize: '1rem' }
    },
    fill: { opacity: 1 },
    legend: {
      fontSize: '20rem',
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 5,
      markers: { width: 25, height: 18 }
    }
  };
  
  return (
    <div id="chart">
      <Chart options={options} series={series} type="bar" height={150} />
    </div>
  );
}

export default BarChart;