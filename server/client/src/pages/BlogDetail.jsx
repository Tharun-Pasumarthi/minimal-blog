import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Stack, Button, TextField, Divider, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000/api';

function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/posts/${id}`);
      setPost(res.data);
    } catch {}
    setLoading(false);
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API}/comments/${id}`);
      setComments(res.data);
    } catch {}
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API}/comments/${id}`, { content: comment });
      setComment('');
      setSnackbar({ open: true, message: 'Comment added!', severity: 'success' });
      fetchComments();
    } catch {
      setSnackbar({ open: true, message: 'Failed to add comment', severity: 'error' });
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    try {
      await axios.delete(`${API}/comments/${commentId}`);
      setSnackbar({ open: true, message: 'Comment deleted!', severity: 'success' });
      fetchComments();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete comment', severity: 'error' });
    }
    setLoading(false);
  };

  if (loading && !post) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  if (!post) return <Typography>Post not found.</Typography>;

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate('/')}>Back</Button>
      <Box p={2} border={1} borderRadius={2} borderColor="grey.200" bgcolor="#fff">
        {post.imageUrl && <Box component="img" src={post.imageUrl} alt={post.title} sx={{ width: '100%', maxHeight: 350, objectFit: 'cover', borderRadius: 2, mb: 2 }} />}
        <Typography variant="h4" fontWeight={700}>{post.title}</Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>{new Date(post.createdAt).toLocaleString()}</Typography>
        <Stack direction="row" spacing={1} mb={1}>
          {post.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
        </Stack>
        <Typography variant="body1" mb={2}>{post.content}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Comments</Typography>
        <Stack spacing={2} mb={2}>
          {comments.map(c => (
            <Box key={c._id} p={1} border={1} borderRadius={1} borderColor="grey.100" bgcolor="#fafafa" display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2">{c.content}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleString()}</Typography>
              </Box>
              <Button size="small" color="error" onClick={() => handleDeleteComment(c._id)}>Delete</Button>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField label="Add a comment" value={comment} onChange={e => setComment(e.target.value)} fullWidth size="small" />
          <Button variant="contained" onClick={handleAddComment} disabled={loading}>Add</Button>
        </Stack>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default BlogDetail; 