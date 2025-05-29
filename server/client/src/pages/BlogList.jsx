import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Grid, Chip, TextField, Stack, Pagination, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000/api';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [search, tag, page]);

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API}/tags`);
      setTags(res.data);
    } catch {}
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/posts`, {
        params: { search, tag, page, limit },
      });
      setPosts(res.data.posts);
      setTotal(res.data.total);
    } catch {}
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h2" align="center" gutterBottom>Minimal Blog</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems="center">
        <TextField label="Search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} size="small" />
        <Stack direction="row" spacing={1}>
          <Chip label="All" color={!tag ? 'primary' : 'default'} onClick={() => { setTag(''); setPage(1); }} />
          {tags.map(t => (
            <Chip key={t._id} label={t.name} color={tag === t.name ? 'primary' : 'default'} onClick={() => { setTag(t.name); setPage(1); }} />
          ))}
        </Stack>
        <Button variant="contained" component={Link} to="/new">Add Post</Button>
      </Stack>
      {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} /> : (
        posts.length === 0 ? <Typography>No posts found.</Typography> : (
          <Stack spacing={3}>
            {posts.map(post => (
              <Box key={post._id} p={2} border={1} borderRadius={2} borderColor="grey.200" bgcolor="#fff">
                <Grid container spacing={2}>
                  {post.imageUrl && (
                    <Grid item xs={12} sm={3}>
                      <Box component="img" src={post.imageUrl} alt={post.title} sx={{ width: '100%', borderRadius: 2 }} />
                    </Grid>
                  )}
                  <Grid item xs>
                    <Typography variant="h5" fontWeight={700}>{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>{new Date(post.createdAt).toLocaleString()}</Typography>
                    <Typography variant="body1" mb={1}>{post.content.slice(0, 150)}{post.content.length > 150 ? '...' : ''}</Typography>
                    <Stack direction="row" spacing={1} mb={1}>
                      {post.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
                    </Stack>
                    <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => navigate(`/edit/${post._id}`)}>Edit</Button>
                    <Button size="small" variant="contained" color="secondary" onClick={() => navigate(`/post/${post._id}`)}>View</Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        )
      )}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination count={Math.ceil(total / limit)} page={page} onChange={(_, val) => setPage(val)} color="primary" />
      </Box>
    </Box>
  );
}

export default BlogList; 