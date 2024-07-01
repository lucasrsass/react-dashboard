import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { tokens } from '../theme';
import 'chart.js/auto';
import './LiveChart.css';

const LiveChart = ({ data, isDashboard = false }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [latency, setLatency] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (data && data.device && data.value) {
      const currentTimestamp = Date.now();
      const dataTimestamp = currentTimestamp; // Assuming the data is generated live
      const newLatency = currentTimestamp - dataTimestamp;
      setLatency(newLatency);

      setChartData((prevState) => {
        const labels = [...prevState.labels, new Date().toLocaleTimeString()];
        const values = [...(prevState.datasets[0]?.data || []), data.value];

        // Limit the data to the latest 50 values
        const limitedLabels = labels.slice(-50);
        const limitedValues = values.slice(-50);

        return {
          labels: limitedLabels,
          datasets: [
            {
              label: 'Random Integer',
              data: limitedValues,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointStyle: 'circle',
              tension: 0.4,
              pointBorderColor: 'rgba(75, 192, 192, 1)',
              pointBackgroundColor: 'rgba(75, 192, 192, 0.8)',
              borderWidth: 2,
            },
          ],
        };
      });
    }
  }, [data]);

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
          fontSize="20px"
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
                grid: {
                  color: colors.grey[700],
                },
              },
              x: {
                ticks: {
                  color: colors.grey[100],
                },
                grid: {
                  color: colors.grey[700],
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: colors.grey[100],
                },
              },
              tooltip: {
                backgroundColor: colors.primary[400],
                titleColor: colors.grey[100],
                bodyColor: colors.grey[100],
                borderColor: colors.greenAccent[500],
                borderWidth: 1,
              },
            },
            elements: {
              point: {
                radius: 5,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
              line: {
                tension: 0.4,
                borderWidth: 2,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              },
            },
          }}
        />
      </div>
    </Box>
  );
};

export default LiveChart;
