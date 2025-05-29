import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import BlogList from './pages/BlogList';
import BlogForm from './pages/BlogForm';
import BlogDetail from './pages/BlogDetail';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
    h2: { fontWeight: 700 },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/new" element={<BlogForm />} />
            <Route path="/edit/:id" element={<BlogForm />} />
            <Route path="/post/:id" element={<BlogDetail />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
