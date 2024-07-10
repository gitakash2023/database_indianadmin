"use client"
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
import { FaInfoCircle } from 'react-icons/fa';
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

const AnswerKey = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    state: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    created_by: '',
  });
  const [answerKeys, setAnswerKeys] = useState([]);
  const [filteredAnswerKeys, setFilteredAnswerKeys] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAnswerKeyId, setCurrentAnswerKeyId] = useState(null);
  const editor = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAnswerKeys();
  }, []);

  const fetchAnswerKeys = async () => {
    try {
      const answerKeysData = await _getAll('api/answer-keys');
      setAnswerKeys(answerKeysData);
      setFilteredAnswerKeys(answerKeysData);
    } catch (error) {
      console.error('Error fetching answer keys:', error);
    }
  };

  const handleOpenModal = (answerKey = null) => {
    if (answerKey) {
      setFormData({
        title: answerKey.title,
        content: answerKey.content,
        slug: answerKey.slug,
        state: answerKey.state,
        metaTitle: answerKey.metaTitle || '',
        metaDescription: answerKey.metaDescription || '',
        canonicalUrl: answerKey.canonicalUrl || '',
        created_by: answerKey.created_by || '',
      });
      setIsEdit(true);
      setCurrentAnswerKeyId(answerKey.id);
    } else {
      setFormData({
        title: '',
        content: '',
        slug: '',
        state: '',
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        created_by: '',
      });
      setIsEdit(false);
      setCurrentAnswerKeyId(null);
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

  const handleSubmit = async () => {
    try {
      const newAnswerKey = { ...formData };

      if (isEdit) {
        await _update(`api/answer-keys/${currentAnswerKeyId}`, newAnswerKey);
        setAnswerKeys(answerKeys.map((answerKey) => (answerKey.id === currentAnswerKeyId ? { ...answerKey, ...newAnswerKey } : answerKey)));
        setFilteredAnswerKeys(filteredAnswerKeys.map((answerKey) => (answerKey.id === currentAnswerKeyId ? { ...answerKey, ...newAnswerKey } : answerKey)));
      } else {
        const response = await _create('api/answer-keys', newAnswerKey);
        setAnswerKeys([...answerKeys, response]);
        setFilteredAnswerKeys([...filteredAnswerKeys, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting answer key:', error);
    }
  };

  const handleDelete = async (answerKeyId) => {
    try {
      await _delete(`/api/answer-keys/${answerKeyId}`);
      setAnswerKeys(answerKeys.filter((answerKey) => answerKey.id !== answerKeyId));
      setFilteredAnswerKeys(filteredAnswerKeys.filter((answerKey) => answerKey.id !== answerKeyId));
    } catch (error) {
      console.error('Error deleting answer key:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = answerKeys.filter((answerKey) =>
      answerKey.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAnswerKeys(filtered);
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'createdAt', headerName: 'Created Date', flex: 1, type: 'date' },
    { field: 'updatedAt', headerName: 'Updated Date', flex: 1, type: 'date' },
    { field: 'created_by', headerName: 'Created By', flex: 1 },
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

  const rows = filteredAnswerKeys.map((answerKey) => ({
    id: answerKey.id,
    title: answerKey.title,
    createdAt: new Date(answerKey.createdAt), // Convert to Date object
    updatedAt: new Date(answerKey.updatedAt), // Convert to Date object
    created_by: answerKey.created_by,
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
      Answer Keys
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
            Add Answer Key
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
            <h2 id="modal-title">{isEdit ? 'Edit Answer Key' : 'Add Answer Key'}</h2>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Title"
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
              <StyledHeading>
                <JoditEditor
                  ref={editor}
                  value={formData.content}
                  tabIndex={1}
                  onChange={(newContent) => setFormData({ ...formData, content: newContent })}
                />
              </StyledHeading>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="slug"
                label="Slug"
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
                label="State"
                value={formData.state}
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
                name="metaTitle"
                label="Meta Title"
                value={formData.metaTitle}
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
                name="metaDescription"
                label="Meta Description"
                value={formData.metaDescription}
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
                name="canonicalUrl"
                label="Canonical URL"
                value={formData.canonicalUrl}
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
                name="created_by"
                label="Created By"
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
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#3B4B5C',
                '&:hover': {
                  backgroundColor: '#54c6ff',
                },
              }}
              onClick={handleSubmit}
            >
              {isEdit ? 'Update Answer Key' : 'Add Answer Key'}
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#3B4B5C',
                color: '#3B4B5C',
                '&:hover': {
                  borderColor: '#54c6ff',
                  color: '#54c6ff',
                },
              }}
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </Box>
    </div>
  );
};

export default AnswerKey;
