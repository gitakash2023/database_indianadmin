"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  IconButton,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { FaInfoCircle } from 'react-icons/fa';
import JoditEditor from 'jodit-react';
import { styled } from '@mui/system';
import axios from 'axios'; // Import axios for HTTP requests
import { _create, _getAll } from '../../utils/apiUtils'; // Import _get and _create functions from apiUtils

// Custom styled component for heading styles
const StyledHeading = styled('div')({
  ' & h2, & h3, & h4, & h5, & h6': {
    backgroundColor: 'blue',
    color: 'white !important',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
});

const StyledContent = styled('div')(({ theme }) => ({
  '& table': {
    width: '100%',
    margin: '20px 0',
    borderCollapse: 'collapse',
    '& th, & td': {
      border: '1px solid #ccc',
      padding: '10px',
    },
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    margin: '20px 0',
  },
  '& p': {
    margin: '10px 0',
  },
  // Specific table styling to override any inline styles
  '& table.MsoTableGridLight, & table.MsoTableGrid': {
    width: '100% !important',
    margin: '20px 0 !important',
    '& th, & td': {
      border: '1px solid #ccc !important',
      padding: '10px !important',
    },
  },
}));

const Jobs = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', created_by: 'Anonymous' }); // Initialize created_by with default value
  const [jobs, setJobs] = useState([]);
  const editor = useRef(null);

  useEffect(() => {
    fetchJobs(); // Load jobs on component mount
  }, []);

  const fetchJobs = async () => {
    try {
      const jobsData = await _getAll('/api/job-posts'); // Fetch jobs using _get function
      setJobs(jobsData); // Set jobs from API response
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Handle error as needed
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const newJob = {
        title: formData.title,
        content: formData.content,
        created_by: formData.created_by, // Include created_by in newJob object
      };

      // Call _create function to post job data
      const response = await _create('/api/job-posts', newJob); // Adjust endpoint as per your API

      // Update jobs state with new job
      setJobs([...jobs, response]);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting job:', error);
      // Handle error as needed
    }
  };

  const renderInputFields = () => (
    <>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="title"
          label="Title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaInfoCircle />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <JoditEditor
          ref={editor}
          value={formData.content}
          onChange={(newContent) => setFormData({ ...formData, content: newContent })}
          style={{
            minHeight: '300px',
            maxHeight: '800px',
            width: '100%',
            border: '1px solid #ccc',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        />
      </Grid>
      {/* Include created_by field */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="created_by"
          label="Created By"
          type="text"
          value={formData.created_by}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaInfoCircle />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </>
  );

  const renderHTMLContent = (htmlContent) => {
    // This function can parse the HTML content and wrap it with StyledContent component
    return (
      <StyledHeading>
        <StyledContent>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </StyledContent>
      </StyledHeading>
    );
  };

  return (
    <div>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Add Jobs
        </Button>
      </Box>
      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 id="modal-title">Add Jobs</h2>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {/* Form Fields */}
          <Grid container spacing={2}>
            {renderInputFields()}
          </Grid>
          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
      <Grid container spacing={2}>
        {jobs.map((job, index) => (
          <Grid item xs={12} key={index}>
            <h2>{job.title}</h2>
            {renderHTMLContent(job.content)} 
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Jobs;
