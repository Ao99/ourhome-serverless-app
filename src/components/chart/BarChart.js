import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { getWeights } from '../../services/WeightService.js';

function BarChart(props) {
  const [series, setSeries] = useState([]);
  const [barColors, setBarColors] = useState([]);
  
  useEffect(() => {
    setCountsAndColors(props.works, props.colors);
  }, [props.works, props.colors]);
  
  async function setCountsAndColors(works, colors) {
    if(colors.size === 0) return;

    var weights = await getWeights();   
    var counts = {};
    works.forEach(work => {
      Object.keys(work).forEach(key => {
        if(key !== 'month' && key !== 'day' && key !== 'updatedAt') {
          var users = work[key];
          users.forEach(user => {
            counts[user] = (counts[user] ? counts[user] : 0)
                         + (weights[key] ? weights[key] : 1);
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
    
    console.log(series);
    setSeries(series);
    
    var barColors = [];
    series.forEach(e => {
      barColors.push(e['color']);
    });

    console.log(barColors);
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
    grid: { show: false },
    stroke: {
        show: false 
    },
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
    <div id="chart" className="mb-n3 ml-n3">
      <Chart options={options} series={series} type="bar" height={135} />
    </div>
  );
}

export default BarChart;