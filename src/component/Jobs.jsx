import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  IconButton,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FaInfoCircle, FaLink, FaGlobe, FaUser } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import CustomButton from "./CustomButton";
import CustomSearchField from "./CustomSearchField";
import CustomTypography from "./CustomTypography";
import CustomTextFieldWithIcon from "./CustomTextFieldWithIcon";
import CustomJoditEditor from "./CustomJoditEditor";
import CustomTable from "./CustomTable";
import { _delete, _getAll, _update, _create } from '../../utils/apiUtils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Jobs = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    state: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    created_by: '',
  });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const inputFields = [
    { name: 'title', label: 'Title', IconComponent: FaInfoCircle },
    { name: 'description', label: 'Description', IconComponent: FaInfoCircle },
    { name: 'slug', label: 'Slug', IconComponent: FaLink },
    { name: 'state', label: 'State', IconComponent: FaGlobe },
    { name: 'metaTitle', label: 'Meta Title', IconComponent: FaInfoCircle },
    { name: 'metaDescription', label: 'Meta Description', IconComponent: FaInfoCircle },
    { name: 'canonicalUrl', label: 'Canonical URL', IconComponent: FaLink },
    { name: 'created_by', label: 'Created By', IconComponent: FaUser },
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const jobsData = await _getAll('api/job-posts');
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleOpenModal = (job = null) => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        slug: job.slug,
        state: job.state,
        metaTitle: job.metaTitle || '',
        metaDescription: job.metaDescription || '',
        canonicalUrl: job.canonicalUrl || '',
        created_by: job.created_by || '',
      });
      setIsEdit(true);
      setCurrentJobId(job.id);
    } else {
      setFormData({
        title: '',
        description: '',
        slug: '',
        state: '',
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        created_by: '',
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

  const handleDescriptionChange = (newDescription) => {
    setFormData({ ...formData, description: newDescription });
  };

  const handleSubmit = async () => {
    try {
      const newJob = { ...formData };

      if (isEdit) {
        await _update(`api/job-posts/${currentJobId}`, newJob);
        setJobs(jobs.map((job) => (job.id === currentJobId ? { ...job, ...newJob } : job)));
        setFilteredJobs(filteredJobs.map((job) => (job.id === currentJobId ? { ...job, ...newJob } : job)));
      } else {
        const response = await _create('api/job-posts', newJob);
        setJobs([...jobs, response]);
        setFilteredJobs([...filteredJobs, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting job:', error);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await _delete(`/api/job-posts/${jobId}`);
      setJobs(jobs.filter((job) => job.id !== jobId));
      setFilteredJobs(filteredJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleSort = (column) => {
    const direction = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortDirection(direction);

    const sortedJobs = [...filteredJobs].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredJobs(sortedJobs);
  };

  const handleDownloadExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(jobs);
      XLSX.utils.book_append_sheet(wb, ws, 'Jobs Data');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'blob' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'jobs_data.xlsx');
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
    }
  };
  

  const headers = [
    { column: 'title', label: 'Job Title' },
    { column: 'createdAt', label: 'Created At' },
    { column: 'updatedAt', label: 'Updated At' },
    { column: 'created_by', label: 'Created By' },
  ];

  return (
    <div>
      <CustomTypography text="JOBS" />

      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CustomSearchField
          onChange={(e) => handleSearch(e.target.value)}
          icon={<SearchIcon sx={{ fontSize: '0.875rem' }} />}
        />
        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <CustomButton
            icon={<DownloadIcon />}
            text="Excel"
            onClick={handleDownloadExcel}
          />
          <CustomButton
            icon={<AddIcon />}
            text="Jobs"
            onClick={() => handleOpenModal()}
          />
        </Box>
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
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 id="modal-title">{isEdit ? 'Edit Job' : 'Add Job'}</h2>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            {inputFields.map((field) => (
              <Grid item xs={12} key={field.name}>
                <CustomTextFieldWithIcon
                  fullWidth
                  name={field.name}
                  label={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  IconComponent={field.IconComponent}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <CustomJoditEditor
                label="Description"
                value={formData.description}
                onChange={(newContent) => handleDescriptionChange(newContent)}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <CustomButton text={isEdit ? 'Update Job' : 'Add Job'} onClick={handleSubmit} />
          </Box>
        </Box>
      </Modal>

      <Box sx={{ mt: 2 }}>
        <CustomTable
          headers={headers}
          data={filteredJobs}
          onSort={handleSort}
          currentSort={sortBy}
          currentDirection={sortDirection}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </Box>
    </div>
  );
};

export default Jobs;
