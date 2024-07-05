"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Button,
  Modal,
  IconButton,
  Grid,
  InputAdornment,
  TextField,
  Card,
  CardContent,
  CardActions,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FaInfoCircle } from 'react-icons/fa';
import { styled } from '@mui/system';
import axios from 'axios'; // Import axios for HTTP requests
import { _create, _getAll, _update, _delete } from '../../utils/apiUtils'; // Import _get, _create, _update, and _delete functions from apiUtils

// Dynamically import JoditEditor
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const StyledHeading = styled('div')({
  '& h2, & h3, & h4, & h5, & h6': {
    backgroundColor: 'blue',
    color: 'white !important',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
});

const Jobs = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    state: '',
    categories: [],
  });
  const [jobs, setJobs] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const editor = useRef(null);

  const categoriesList = ['Category 1', 'Category 2', 'Category 3']; // Example categories
  const statesList = ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal']; // Example states

  useEffect(() => {
    fetchJobs(); // Load jobs on component mount
  }, []);

  const fetchJobs = async () => {
    try {
      const jobsData = await _getAll('/api/job-posts'); // Fetch jobs using _get function
      setJobs(jobsData); // Set jobs from API response
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleOpenModal = (job = null) => {
    if (job) {
      setFormData({
        title: job.title,
        content: job.content,
        slug: job.slug,
        state: job.state,
        categories: job.categories,
      });
      setIsEdit(true);
      setCurrentJobId(job.id);
    } else {
      setFormData({
        title: '',
        content: '',
        slug: '',
        state: '',
        categories: [],
      });
      setIsEdit(false);
      setCurrentJobId(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (category) => {
    setFormData((prevState) => ({
      ...prevState,
      categories: prevState.categories.includes(category)
        ? prevState.categories.filter((cat) => cat !== category)
        : [...prevState.categories, category],
    }));
  };

  const handleSubmit = async () => {
    try {
      const newJob = {
        title: formData.title,
        content: formData.content,
        slug: formData.slug,
        state: formData.state,
        categories: formData.categories,
      };

      if (isEdit) {
        await _update(`/api/job-posts/${currentJobId}`, newJob);
        setJobs(jobs.map(job => (job.id === currentJobId ? { ...job, ...newJob } : job)));
      } else {
        const response = await _create('/api/job-posts', newJob);
        setJobs([...jobs, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting job:', error);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await _delete(`/api/job-posts/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
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
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="slug"
          label="Slug"
          type="text"
          value={formData.slug}
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
        <TextField
          fullWidth
          name="state"
          select
          label="State"
          SelectProps={{
            native: true,
          }}
          value={formData.state}
          onChange={handleChange}
        >
          <option value="">Select State</option>
          {statesList.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Categories</FormLabel>
          <FormGroup>
            {categoriesList.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    name={category}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Grid>
    </>
  );

  return (
    <div>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#3B4B5C',
            '&:hover': {
              backgroundColor: '#54c6ff',
            },
          }}
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Add Jobs
        </Button>
      </Box>
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
            <h2 id="modal-title">{isEdit ? 'Edit Job' : 'Add Job'}</h2>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            {renderInputFields()}
          </Grid>
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
            <Card>
              <CardContent>
                <h2>{job.title}</h2>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenModal(job)}
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(job.id)}
                  color="secondary"
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Jobs;
