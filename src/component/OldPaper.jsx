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

const OldPaper = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    postTitle: '',
    category: '',
    subject: '',
    shortDescription: '',
    pdf: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    slug: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
  });
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPaperId, setCurrentPaperId] = useState(null);
  const editor = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const papersData = await _getAll('api/old-papers');
      setPapers(papersData);
      setFilteredPapers(papersData);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

  const handleOpenModal = (paper = null) => {
    if (paper) {
      setFormData({
        postTitle: paper.postTitle,
        category: paper.category,
        subject: paper.subject,
        shortDescription: paper.shortDescription,
        pdf: paper.pdf || '',
        metaTitle: paper.metaTitle || '',
        metaDescription: paper.metaDescription || '',
        canonicalUrl: paper.canonicalUrl || '',
        slug: paper.slug || '',
        createdAt: paper.createdAt || '',
        updatedAt: paper.updatedAt || '',
        createdBy: paper.createdBy || '',
      });
      setIsEdit(true);
      setCurrentPaperId(paper.id);
    } else {
      setFormData({
        postTitle: '',
        category: '',
        subject: '',
        shortDescription: '',
        pdf: '',
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        slug: '',
        createdAt: '',
        updatedAt: '',
        createdBy: '',
      });
      setIsEdit(false);
      setCurrentPaperId(null);
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
      setFormData({ ...formData, pdf: file.name });
    } else {
      setFormData({ ...formData, pdf: '' });
    }
  };

  const handleSubmit = async () => {
    try {
      const newPaper = { ...formData };

      if (isEdit) {
        await _update(`api/old-papers/${currentPaperId}`, newPaper);
        setPapers(papers.map((paper) => (paper.id === currentPaperId ? { ...paper, ...newPaper } : paper)));
        setFilteredPapers(filteredPapers.map((paper) => (paper.id === currentPaperId ? { ...paper, ...newPaper } : paper)));
      } else {
        const response = await _create('api/old-papers', newPaper);
        setPapers([...papers, response]);
        setFilteredPapers([...filteredPapers, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting paper:', error);
    }
  };

  const handleDelete = async (paperId) => {
    try {
      await _delete(`/api/old-papers/${paperId}`);
      setPapers(papers.filter((paper) => paper.id !== paperId));
      setFilteredPapers(filteredPapers.filter((paper) => paper.id !== paperId));
    } catch (error) {
      console.error('Error deleting paper:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = papers.filter((paper) =>
      paper.postTitle.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPapers(filtered);
  };

  const columns = [
    { field: 'postTitle', headerName: 'Post Title', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'shortDescription', headerName: 'Short Description', flex: 1 },
    { field: 'pdf', headerName: 'PDF', flex: 1 },
 
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

  const rows = filteredPapers.map((paper) => ({
    id: paper.id,
    postTitle: paper.postTitle,
    category: paper.category,
    subject: paper.subject,
    shortDescription: paper.shortDescription,
    pdf: paper.pdf,
    metaTitle: paper.metaTitle,
    metaDescription: paper.metaDescription,
    canonicalUrl: paper.canonicalUrl,
    slug: paper.slug,
    createdAt: new Date(paper.createdAt), // Convert to Date object
    updatedAt: new Date(paper.updatedAt), // Convert to Date object
    createdBy: paper.createdBy,
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
          textAlign: 'center',
        }}
      >
        Old Papers
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
            Add Paper
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
          <Typography variant="h5" id="modal-title" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
  {isEdit ? 'Edit Paper' : 'Add New Paper'}
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
                label="Post Title"
                variant="outlined"
                name="postTitle"
                value={formData.postTitle}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Category"
                variant="outlined"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Subject"
                variant="outlined"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PDF File"
                type="file"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={handleFileChange}
                inputProps={{ accept: '.pdf' }}
              />
              {formData.pdf && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Selected File: {formData.pdf}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <StyledHeading>
                <Typography >
                  Short Description
                </Typography>
              </StyledHeading>
              <JoditEditor
                ref={editor}
                value={formData.shortDescription}
                tabIndex={1} // tabIndex of textarea
                onChange={(content) => handleChangeEditor(content)}
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
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {isEdit ? 'Update Paper' : 'Add Paper'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default OldPaper;
