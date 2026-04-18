import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const getGradient = (ctx, chartArea) => {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, '#10ac84');
  gradient.addColorStop(1, '#55efc4');
  return gradient;
};

const StatChart = ({ habits, currentTheme, interval = 7 }) => {
  const isDark = currentTheme === 'dark';
  const textColor = isDark ? '#e0e0e0' : '#2d3436'; 
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const getPastDays = (daysCount) => {
    const days = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const targetDays = getPastDays(interval);

  const completedCounts = targetDays.map(date => {
    let count = 0;
    habits.forEach(habit => {
      if (habit.completedDates.includes(date)) count++;
    });
    return count;
  });

  const labels = targetDays.map(dateStr => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const data = {
    labels,
    datasets: [{
      data: completedCounts,
      backgroundColor: (context) => {
        const { ctx, chartArea } = context.chart;
        if (!chartArea) return null;
        return getGradient(ctx, chartArea);
      },
      borderRadius: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 30 } },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: isDark ? '#2d3436' : '#fff', titleColor: textColor, bodyColor: textColor, borderColor: gridColor, borderWidth: 1 }
    },
    scales: {
      x: { 
        ticks: { color: textColor, font: { size: interval > 14 ? 10 : 12 } }, // Зменшуємо шрифт для 30 днів
        grid: { display: false } 
      },
      y: { ticks: { color: textColor, stepSize: 1 }, grid: { color: gridColor }, beginAtZero: true },
    },
  };

  const topLabelsPlugin = {
    id: 'topLabels',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar, index) => {
          const dataValue = dataset.data[index];
          if (dataValue > 0 && interval <= 14) {
            ctx.fillStyle = textColor; 
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.font = 'bold 15px "Inter", sans-serif'; 
            ctx.fillText(dataValue, bar.x, bar.y - 6);
          }
        });
      });
    }
  };

  return (
    <div style={{ height: '280px', width: '100%' }}>
      <Bar key={currentTheme} data={data} options={options} plugins={[topLabelsPlugin]} />
    </div>
  );
};

export default StatChart;