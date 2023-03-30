import React from 'react';
import { CircularProgress, Box } from '@mui/material';

function LoadingSpinner() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default LoadingSpinner;
