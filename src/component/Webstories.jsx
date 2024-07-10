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
  Typography,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import { _create, _getAll, _update, _delete } from '../../utils/apiUtils';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';

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

const Webstories = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    images: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
  });
  const [webstories, setWebstories] = useState([]);
  const [filteredWebstories, setFilteredWebstories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentWebstoryId, setCurrentWebstoryId] = useState(null);
  const editor = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWebstories();
  }, []);

  const fetchWebstories = async () => {
    try {
      const webstoriesData = await _getAll('api/webstories');
      setWebstories(webstoriesData);
      setFilteredWebstories(webstoriesData);
    } catch (error) {
      console.error('Error fetching webstories:', error);
    }
  };

  const handleOpenModal = (webstory = null) => {
    if (webstory) {
      setFormData({
        title: webstory.title,
        shortDescription: webstory.shortDescription,
        images: webstory.images || '',
        slug: webstory.slug || '',
        metaTitle: webstory.metaTitle || '',
        metaDescription: webstory.metaDescription || '',
        canonicalUrl: webstory.canonicalUrl || '',
      });
      setIsEdit(true);
      setCurrentWebstoryId(webstory.id);
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        images: '',
        slug: '',
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
      });
      setIsEdit(false);
      setCurrentWebstoryId(null);
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

  const handleChangeEditor = (content) => {
    setFormData({ ...formData, shortDescription: content });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, images: file.name });
    } else {
      setFormData({ ...formData, images: '' });
    }
  };

  const handleSubmit = async () => {
    try {
      const newWebstory = { ...formData };

      if (isEdit) {
        await _update(`api/webstories/${currentWebstoryId}`, newWebstory);
        setWebstories(webstories.map((webstory) => (webstory.id === currentWebstoryId ? { ...webstory, ...newWebstory } : webstory)));
        setFilteredWebstories(filteredWebstories.map((webstory) => (webstory.id === currentWebstoryId ? { ...webstory, ...newWebstory } : webstory)));
      } else {
        const response = await _create('api/webstories', newWebstory);
        setWebstories([...webstories, response]);
        setFilteredWebstories([...filteredWebstories, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting webstory:', error);
    }
  };

  const handleDelete = async (webstoryId) => {
    try {
      await _delete(`/api/webstories/${webstoryId}`);
      setWebstories(webstories.filter((webstory) => webstory.id !== webstoryId));
      setFilteredWebstories(filteredWebstories.filter((webstory) => webstory.id !== webstoryId));
    } catch (error) {
      console.error('Error deleting webstory:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = webstories.filter((webstory) =>
      webstory.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWebstories(filtered);
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'shortDescription', headerName: 'Short Description', flex: 1 },
    { field: 'images', headerName: 'Images', flex: 1 },
    { field: 'createdAt', headerName: 'Created Date', flex: 1, type: 'date' },
    { field: 'updatedAt', headerName: 'Updated Date', flex: 1, type: 'date' },
    { field: 'createdBy', headerName: 'Created By', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleOpenModal(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = filteredWebstories.map((webstory) => ({
    id: webstory.id,
    title: webstory.title,
    shortDescription: webstory.shortDescription,
    images: webstory.images,
    slug: webstory.slug,
    metaTitle: webstory.metaTitle,
    metaDescription: webstory.metaDescription,
    canonicalUrl: webstory.canonicalUrl,
  }));

  return (
    <div>
      <Typography
        variant="h2"
        component="div"
        style={{
          color: '#54c6ff',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          textAlign: 'center',
          fontSize: '28px',
        }}
      >
        Webstories
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div>
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
            Add Webstory
          </Button>
        </div>
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
            <Typography variant="h5" id="modal-title" sx={{ fontWeight: 'bold' }}>
              {isEdit ? 'Edit Webstory' : 'Add New Webstory'}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Title"
                variant="outlined"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledHeading>
                <Typography >Short Description</Typography>
              </StyledHeading>
              <JoditEditor
                ref={editor}
                value={formData.shortDescription}
                tabIndex={1}
                onChange={handleChangeEditor}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Image"
                variant="outlined"
                type="file"
                name="image"
                onChange={handleFileChange}
                InputLabelProps={{ shrink: true }}
              />
              {formData.image && <Typography>{formData.image}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Slug"
                variant="outlined"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Meta Title"
                variant="outlined"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Meta Description"
                variant="outlined"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Canonical URL"
                variant="outlined"
                name="canonicalUrl"
                value={formData.canonicalUrl}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#3B4B5C',
                  '&:hover': {
                    backgroundColor: '#54c6ff',
                  },
                }}
              >
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
      </Box>
    </div>
  );
};

export default Webstories;
