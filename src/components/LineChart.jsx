import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchData } from '../services/influxdbService'; // Ensure this path is correct
import 'chart.js/auto';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { tokens } from '../theme';
import './LiveChart.css';

const LiveChart = ({ isDashboard = false }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [latency, setLatency] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData();
        console.log('Fetched data:', data);

        if (data && data.length > 0) {
          const currentTimestamp = Date.now();
          const dataTimestamp = new Date(data[0].timestamp).getTime();
          const newLatency = currentTimestamp - dataTimestamp;
          setLatency(newLatency);

          const labels = data.map((d) => new Date(d.time).toLocaleTimeString());
          const values = data.map((d) => d.value);

          // Limit the data to the latest 50 values
          const limitedLabels = labels.slice(-50);
          const limitedValues = values.slice(-50);

          setChartData({
            labels: limitedLabels,
            datasets: [
              {
                label: 'Random Integer',
                data: limitedValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointStyle: 'rectRot',
                tension: 0.3,
              },
            ],
          });
        } else {
          console.warn('No data received from fetchData');
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    const intervalId = setInterval(getData, 1000); // Fetch new data every 1 second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        padding: '20px',
        backgroundColor: colors.primary[400],
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <Typography
          variant="h5"
          fontWeight="600"
          color={colors.greenAccent[500]}
        >
          Random Integer
        </Typography>
        <IconButton>
          <DownloadOutlinedIcon sx={{ color: colors.greenAccent[500] }} />
        </IconButton>
      </Box>
      <Typography variant="body1" color={colors.grey[100]}>
        Latency: {latency} ms
      </Typography>
      <div
        className="chart-wrapper"
        style={{ height: isDashboard ? '350px' : '400px' }}
      >
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 10,
                  color: colors.grey[100],
                },
              },
              x: {
                ticks: {
                  color: colors.grey[100],
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: colors.grey[100],
                },
              },
            },
          }}
        />
      </div>
    </Box>
  );
};

export default LiveChart;
