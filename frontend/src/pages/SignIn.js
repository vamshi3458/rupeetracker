import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

function SignIn({ setIsAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      setIsAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign in failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '350px' }} className="p-3 shadow">
        <h3 className="mb-3 text-center">Sign In</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">Sign In</Button>
        </Form>
        <div className="mt-3 text-center">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Card>
    </Container>
  );
}

export default SignIn;