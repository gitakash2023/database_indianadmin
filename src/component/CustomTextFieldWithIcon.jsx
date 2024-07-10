// components/CustomTextFieldWithIcon.js
import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/system';

const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        backgroundColor: '#f9f9f9',
    },
});

const CustomTextFieldWithIcon = ({ label, value, onChange, name, fullWidth = true, IconComponent, ...props }) => {
    return (
        <StyledTextField
            fullWidth={fullWidth}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            InputProps={{
                startAdornment: IconComponent && (
                    <InputAdornment position="start">
                        <IconComponent />
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    );
};

export default CustomTextFieldWithIcon;
