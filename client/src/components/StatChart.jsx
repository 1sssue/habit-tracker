import React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartCard = styled.div`
  background: ${(props) => props.theme.cardBg};
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid ${(props) => props.theme.border};
  transition: all 0.3s ease;

  h3 {
    margin-bottom: 20px;
    text-align: center;
    color: ${(props) => props.theme.text};
  }
`;

const getGradient = (ctx, chartArea) => {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, '#10ac84'); // Темніший зелений знизу
  gradient.addColorStop(1, '#55efc4'); // Світліший зелений зверху
  return gradient;
};

const StatChart = ({ habits, currentTheme }) => {

  const isDark = currentTheme === 'dark';
  const textColor = isDark ? '#e0e0e0' : '#2d3436'; 
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const completedCounts = last7Days.map(date => {
    let count = 0;
    habits.forEach(habit => {
      if (habit.completedDates.includes(date)) {
        count++;
      }
    });
    return count;
  });

  const labels = last7Days.map(dateStr => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Виконано звичок',
        data: completedCounts,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return getGradient(ctx, chartArea);
        },
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 30
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#2d3436' : '#fff',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { family: "'Segoe UI', sans-serif", size: 12 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: textColor, font: { family: "'Segoe UI', sans-serif", size: 12 }, stepSize: 1 },
        grid: { color: gridColor },
        beginAtZero: true,
      },
    },
    animation: { duration: 1000, easing: 'easeOutQuart' },
  };

  const topLabelsPlugin = {
    id: 'topLabels',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        
        meta.data.forEach((bar, index) => {
          const dataValue = dataset.data[index];
          
          if (dataValue > 0) {
            ctx.fillStyle = textColor;
            ctx.textBaseline = 'bottom';
            ctx.font = 'bold 15px "Segoe UI", sans-serif'; // Жирний і гарний шрифт
            
            ctx.fillText(dataValue, bar.x, bar.y - 8);
          }
        });
      });
    }
  };

  return (
    <ChartCard>
      <h3>Твоя активність за тиждень</h3>
      <div style={{ height: '250px' }}>
        <Bar data={data} options={options} plugins={[topLabelsPlugin]} />
      </div>
    </ChartCard>
  );
};

export default StatChart;