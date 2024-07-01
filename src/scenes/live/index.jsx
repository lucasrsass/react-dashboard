import React from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import LiveChart from '../../components/LiveChart';

const Live = ({ data }) => {
  return (
    <Box m="20px">
      <Header title="Live Chart" subtitle="Real-time data visualization" />
      <Box height="75vh">
        <LiveChart data={data} />
      </Box>
    </Box>
  );
};

export default Live;
