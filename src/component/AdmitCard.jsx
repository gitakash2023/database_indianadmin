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

const AdmitCard = () => {
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
  const [admitCards, setAdmitCards] = useState([]);
  const [filteredAdmitCards, setFilteredAdmitCards] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAdmitCardId, setCurrentAdmitCardId] = useState(null);
  const editor = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAdmitCards();
  }, []);

  const fetchAdmitCards = async () => {
    try {
      const admitCardsData = await _getAll('api/admit-cards');
      setAdmitCards(admitCardsData);
      setFilteredAdmitCards(admitCardsData);
    } catch (error) {
      console.error('Error fetching admit cards:', error);
    }
  };

  const handleOpenModal = (admitCard = null) => {
    if (admitCard) {
      setFormData({
        title: admitCard.title,
        content: admitCard.content,
        slug: admitCard.slug,
        state: admitCard.state,
        metaTitle: admitCard.metaTitle || '',
        metaDescription: admitCard.metaDescription || '',
        canonicalUrl: admitCard.canonicalUrl || '',
        created_by: admitCard.created_by || '',
      });
      setIsEdit(true);
      setCurrentAdmitCardId(admitCard.id);
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
      setCurrentAdmitCardId(null);
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
      const newAdmitCard = { ...formData };

      if (isEdit) {
        await _update(`api/admit-cards/${currentAdmitCardId}`, newAdmitCard);
        setAdmitCards(admitCards.map((admitCard) => (admitCard.id === currentAdmitCardId ? { ...admitCard, ...newAdmitCard } : admitCard)));
        setFilteredAdmitCards(filteredAdmitCards.map((admitCard) => (admitCard.id === currentAdmitCardId ? { ...admitCard, ...newAdmitCard } : admitCard)));
      } else {
        const response = await _create('api/admit-cards', newAdmitCard);
        setAdmitCards([...admitCards, response]);
        setFilteredAdmitCards([...filteredAdmitCards, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting admit card:', error);
    }
  };

  const handleDelete = async (admitCardId) => {
    try {
      await _delete(`/api/admit-cards/${admitCardId}`);
      setAdmitCards(admitCards.filter((admitCard) => admitCard.id !== admitCardId));
      setFilteredAdmitCards(filteredAdmitCards.filter((admitCard) => admitCard.id !== admitCardId));
    } catch (error) {
      console.error('Error deleting admit card:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = admitCards.filter((admitCard) =>
      admitCard.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAdmitCards(filtered);
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

  const rows = filteredAdmitCards.map((admitCard) => ({
    id: admitCard.id,
    title: admitCard.title,
    createdAt: new Date(admitCard.createdAt), // Convert to Date object
    updatedAt: new Date(admitCard.updatedAt), // Convert to Date object
    created_by: admitCard.created_by,
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
      Admit Cards
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
            Add Admit Card
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
            <h2 id="modal-title">{isEdit ? 'Edit Admit Card' : 'Add Admit Card'}</h2>
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
              <JoditEditor
                ref={editor}
                value={formData.content}
                onChange={(newContent) => setFormData({ ...formData, content: newContent })}
                style={{
                  minHeight: '300px',
                  border: '1px solid #ccc',
                  padding: '10px',
                }}
              />
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
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#3B4B5C',
                  '&:hover': {
                    backgroundColor: '#54c6ff',
                  },
                }}
              >
                {isEdit ? 'Update' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </div>
    </div>
  );
};

export default AdmitCard;
