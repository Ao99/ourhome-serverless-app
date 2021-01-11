import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

function BarChart(props) {
  const [series, setSeries] = useState([]);
  
  useEffect(() => {
    countWorks(props.works);
  }, [props.works]);
  
  function countWorks(works) {
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
        data: [counts[user]]
      });
    });
    series.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 

    setSeries(series);
  }
    
  var options = {
    chart: {
      stacked: true,
      stackType: '100%',
      toolbar: { show: false }
    },
    theme: { mode: 'dark' },
    colors: ['#FF9800', '#2E93fA', '#66DA26', '#546E7A', '#E91E63'],
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
      fontSize: '18rem',
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 5,
      markers: { width: 20, height: 15 }
    }
  };
  
  return (
    <div id="chart">
      <Chart options={options} series={series} type="bar" height={150} />
    </div>
  );
}

export default BarChart;