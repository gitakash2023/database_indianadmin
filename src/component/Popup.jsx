"use client"
import React, { useState } from 'react';
import { Modal, Backdrop, Fade, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Popup = () => {
  const [open, setOpen] = useState(true); // Initial state: pop-up is open

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom>
            Welcome to our Website
          </Typography>
          {/* Add your content here */}
        </Box>
      </Fade>
    </Modal>
  );
};

export default Popup;
