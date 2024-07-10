// components/CustomJoditEditor.js
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const CustomJoditEditor = ({ label, value, onChange }) => {
  const editor = useRef(null);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <JoditEditor
        ref={editor}
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default CustomJoditEditor;
