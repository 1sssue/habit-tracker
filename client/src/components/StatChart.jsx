import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-top: 30px;
`;

const StatChart = ({ habits }) => {
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const last7Days = getLast7Days();

  const dataCounts = last7Days.map(date => {
    return habits.filter(habit => habit.completedDates.includes(date)).length;
  });

  const labels = last7Days.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Виконано звичок',
        data: dataCounts,
        backgroundColor: '#1dd1a1',
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Твоя активність за останні 7 днів' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <ChartContainer>
      <Bar options={options} data={data} />
    </ChartContainer>
  );
};

export default StatChart;