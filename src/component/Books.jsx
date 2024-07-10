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

const Books = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nameOfBook: '',
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
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const editor = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const booksData = await _getAll('api/books');
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setFormData({
        nameOfBook: book.nameOfBook,
        category: book.category,
        subject: book.subject,
        shortDescription: book.shortDescription,
        pdf: book.pdf || '',
        metaTitle: book.metaTitle || '',
        metaDescription: book.metaDescription || '',
        canonicalUrl: book.canonicalUrl || '',
        slug: book.slug || '',
        createdAt: book.createdAt || '',
        updatedAt: book.updatedAt || '',
        createdBy: book.createdBy || '',
      });
      setIsEdit(true);
      setCurrentBookId(book.id);
    } else {
      setFormData({
        nameOfBook: '',
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
      setCurrentBookId(null);
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
      const newBook = { ...formData };

      if (isEdit) {
        await _update(`api/books/${currentBookId}`, newBook);
        setBooks(books.map((book) => (book.id === currentBookId ? { ...book, ...newBook } : book)));
        setFilteredBooks(filteredBooks.map((book) => (book.id === currentBookId ? { ...book, ...newBook } : book)));
      } else {
        const response = await _create('api/books', newBook);
        setBooks([...books, response]);
        setFilteredBooks([...filteredBooks, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting book:', error);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await _delete(`/api/books/${bookId}`);
      setBooks(books.filter((book) => book.id !== bookId));
      setFilteredBooks(filteredBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = books.filter((book) =>
      book.nameOfBook.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const columns = [
    { field: 'nameOfBook', headerName: 'Name of Book', flex: 1 },
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

  const rows = filteredBooks.map((book) => ({
    id: book.id,
    nameOfBook: book.nameOfBook,
    category: book.category,
    subject: book.subject,
    shortDescription: book.shortDescription,
    pdf: book.pdf,
    metaTitle: book.metaTitle,
    metaDescription: book.metaDescription,
    canonicalUrl: book.canonicalUrl,
    slug: book.slug,
    createdAt: new Date(book.createdAt), // Convert to Date object
    updatedAt: new Date(book.updatedAt), // Convert to Date object
    createdBy: book.createdBy,
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
        Books
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
              Add Books
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2" id="modal-title">
              {isEdit ? 'Edit Book' : 'Add Book'}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseModal} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>

          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name of Book"
                  name="nameOfBook"
                  value={formData.nameOfBook}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  fullWidth
                />
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
                tabIndex={1} 
                onChange={(content) => handleChangeEditor(content)}
              />
            </Grid>
              <Grid item xs={12}>
                <TextField
                  type="file"
                  onChange={handleFileChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formData.pdf && (
                          <Typography variant="body2" color="textSecondary">
                            {formData.pdf}
                          </Typography>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Meta Title"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Meta Description"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Canonical URL"
                  name="canonicalUrl"
                  value={formData.canonicalUrl}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
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
                {isEdit ? 'Update' : 'Add'} Book
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </div>
    </div>
  );
};

export default Books;
