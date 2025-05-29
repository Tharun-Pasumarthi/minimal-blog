import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Stack, Chip, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000/api';

function BlogForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    fetchTags();
    if (id) fetchPost();
  }, [id]);

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API}/tags`);
      setAllTags(res.data);
    } catch {}
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/posts/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setTags(res.data.tags);
      setImageUrl(res.data.imageUrl || '');
    } catch {}
    setLoading(false);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/image/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(res.data.imageUrl);
      setSnackbar({ open: true, message: 'Image uploaded!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Image upload failed', severity: 'error' });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { title, content, tags, imageUrl };
      if (id) {
        await axios.put(`${API}/posts/${id}`, data);
        setSnackbar({ open: true, message: 'Post updated!', severity: 'success' });
      } else {
        await axios.post(`${API}/posts`, data);
        setSnackbar({ open: true, message: 'Post created!', severity: 'success' });
      }
      setTimeout(() => navigate('/'), 1000);
    } catch {
      setSnackbar({ open: true, message: 'Error saving post', severity: 'error' });
    }
    setLoading(false);
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(t => t !== tagToDelete));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" mb={2}>{id ? 'Edit Post' : 'New Post'}</Typography>
      <Stack spacing={2}>
        <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} required fullWidth />
        <TextField label="Content" value={content} onChange={e => setContent(e.target.value)} required fullWidth multiline minRows={4} />
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField label="Add Tag" value={tagInput} onChange={e => setTagInput(e.target.value)} size="small" onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : null} />
          <Button onClick={handleAddTag} variant="outlined">Add</Button>
          {allTags.map(t => (
            <Chip key={t._id} label={t.name} onClick={() => setTagInput(t.name)} size="small" />
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          {tags.map(tag => <Chip key={tag} label={tag} onDelete={() => handleDeleteTag(tag)} color="primary" />)}
        </Stack>
        <Button variant="contained" component="label">
          {imageUrl ? 'Change Image' : 'Upload Image'}
          <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={e => e.target.files[0] && handleImageUpload(e.target.files[0])} />
        </Button>
        {imageUrl && <Box component="img" src={imageUrl} alt="Post" sx={{ width: 200, borderRadius: 2, my: 1 }} />}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? <CircularProgress size={24} /> : id ? 'Update Post' : 'Create Post'}</Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>Cancel</Button>
      </Stack>
      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default BlogForm; 