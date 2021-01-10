import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts'

function BarChart() {
  const percentages = useState({});
  var series = [{
      name: 'ao',
      data: [20]
    }, {
      name: 'shan',
      data: [23]
    }, {
      name: 'test',
      data: [5]
    }];
  var options = {
    chart: {
      stacked: true,
      stackType: '100%',
      toolbar: { show: false }
    },
    theme: { mode: 'dark' },
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
      markers: {
        width: 20,
        height: 15
      }
    }
  };
  
  return (
    <div id="chart">
      <Chart options={options} series={series} type="bar" height={150} />
    </div>
  );
}

export default BarChart;