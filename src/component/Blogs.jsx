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

const Blog = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    category: '',
    contentPage: '',
    image: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    slug: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
  });
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const editor = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsData = await _getAll('api/blogs');
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setFormData({
        name: blog.name,
        title: blog.title,
        category: blog.category,
        contentPage: blog.contentPage,
        image: blog.image || '',
        content: blog.content || '',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        canonicalUrl: blog.canonicalUrl || '',
        slug: blog.slug || '',
        createdAt: blog.createdAt || '',
        updatedAt: blog.updatedAt || '',
        createdBy: blog.createdBy || '',
      });
      setIsEdit(true);
      setCurrentBlogId(blog.id);
    } else {
      setFormData({
        name: '',
        title: '',
        category: '',
        contentPage: '',
        image: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        slug: '',
        createdAt: '',
        updatedAt: '',
        createdBy: '',
      });
      setIsEdit(false);
      setCurrentBlogId(null);
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
    setFormData({ ...formData, content: content });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file.name });
    } else {
      setFormData({ ...formData, image: '' });
    }
  };

  const handleSubmit = async () => {
    try {
      const newBlog = { ...formData };

      if (isEdit) {
        await _update(`api/blogs/${currentBlogId}`, newBlog);
        setBlogs(blogs.map((blog) => (blog.id === currentBlogId ? { ...blog, ...newBlog } : blog)));
        setFilteredBlogs(filteredBlogs.map((blog) => (blog.id === currentBlogId ? { ...blog, ...newBlog } : blog)));
      } else {
        const response = await _create('api/blogs', newBlog);
        setBlogs([...blogs, response]);
        setFilteredBlogs([...filteredBlogs, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await _delete(`/api/blogs/${blogId}`);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      setFilteredBlogs(filteredBlogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = blogs.filter((blog) =>
      blog.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };

  const columns = [
    
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
   
    { field: 'image', headerName: 'Image', flex: 1 },
    { field: 'content', headerName: 'Content', flex: 1 },
  
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

  const rows = filteredBlogs.map((blog) => ({
    id: blog.id,
    name: blog.name,
    title: blog.title,
    category: blog.category,
    contentPage: blog.contentPage,
    image: blog.image,
    content: blog.content,
    metaTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    canonicalUrl: blog.canonicalUrl,
    slug: blog.slug,
    createdAt: new Date(blog.createdAt), // Convert to Date object
    updatedAt: new Date(blog.updatedAt), // Convert to Date object
    createdBy: blog.createdBy,
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
        Blog
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
            Add Blog
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
              {isEdit ? 'Edit Blog' : 'Add New Blog'}
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
                label="Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
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
                label="Content Page"
                variant="outlined"
                name="contentPage"
                value={formData.contentPage}
                onChange={handleChange}
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
            <Grid item xs={12}>
              <JoditEditor
                ref={editor}
                value={formData.content}
                tabIndex={1}
                onChange={(content) => handleChangeEditor(content)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
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
                required
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
                required
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
                required
                label="Slug"
                variant="outlined"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#3B4B5C', '&:hover': { backgroundColor: '#54c6ff' } }}
              onClick={handleSubmit}
            >
              {isEdit ? 'Update Blog' : 'Add Blog'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Displaying Blogs */}
      <Box sx={{ mt: 4 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default Blog;
