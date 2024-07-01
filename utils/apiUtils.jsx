const axios = require('axios');

// Function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  throw new Error('An error occurred while communicating with the API');
};

const BASE_URL = 'https://backend.indiadatabaseprovider.com';




// Function to retrieve all posts
const _getAll = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
// Function to create a new post
const _create = async (endpoint, postData) => {
  try {
    console.log('Sending request to:', `${BASE_URL}/${endpoint}`);
    const response = await axios.post(`${BASE_URL}/${endpoint}`, postData);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
// Function to retrieve a single post by ID
const _getById = async (endpoint, id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to update a post
const _update = async (endpoint, id, postData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${endpoint}`, { id, ...postData });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


// Function to delete a post by ID
const _delete = async (endpoint, id) => {
  try {
    await axios.delete(`${BASE_URL}/${endpoint}`, { data: { id } });
    return true;
  } catch (error) {
    handleApiError(error);
  }
};

module.exports = { _create, _getAll, _getById, _update, _delete };
