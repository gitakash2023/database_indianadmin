import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const CustomSearchField = ({
  onChange,
  icon,
  placeholderColor,
  borderColor ,
  inputColor,
  inputTextBgColor ,
  inputTextSize = '0.875rem',
}) => {
  return (
    <TextField
      label="Search"
      variant="outlined"
      size="small"
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ),
        style: {
          color: inputColor,
          backgroundColor: inputTextBgColor,
          fontSize: inputTextSize,
        },
      }}
      sx={{
        '& .MuiInputLabel-root': { fontSize: '0.875rem' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: borderColor,
          },
          '&:hover fieldset': {
            borderColor: borderColor,
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: placeholderColor,
          opacity: 1,
        },
      }}
    />
  );
};

export default CustomSearchField;
