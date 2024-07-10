import React from 'react';
import Button from '@mui/material/Button';



const CustomButton = ({ icon, text, onClick }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#3B4B5C',
        '&:hover': {
          backgroundColor: '#54c6ff',
        },
        '& .MuiButton-startIcon': {
          fontSize: '0.875rem',
        },
        '& .MuiButton-label': {
          fontSize: '0.875rem',
          fontWeight: 400,
          fontFamily: 'Public Sans, sans-serif',
        },
      }}
      startIcon={icon}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
