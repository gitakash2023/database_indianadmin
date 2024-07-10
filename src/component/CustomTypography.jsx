import React from 'react';
import Typography from '@mui/material/Typography';

const CustomTypography = ({ text }) => {
  return (
    <Typography
      variant="h2"
      component="div"
      sx={{
        color: 'black',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '1rem',
      }}
    >
      {text}
    </Typography>
  );
};

export default CustomTypography;
