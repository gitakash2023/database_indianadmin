import React from 'react';
import { Button } from '@mui/material';

const CustomCancelButton = ({ handleCloseModal }) => {
  return (
    <Button
      variant="outlined"
      onClick={handleCloseModal}
      sx={{
        borderColor: '#3B4B5C',
        color: '#3B4B5C',
        '&:hover': {
          borderColor: '#54c6ff',
          color: '#54c6ff',
        },
      }}
    >
      Cancel
    </Button>
  );
};

export default CustomCancelButton;

