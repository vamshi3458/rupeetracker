import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from '../utils/axiosInstance';

const categories = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'];
const paymentModes = ['UPI', 'Credit Card', 'Net Banking', 'Cash'];

function AddExpense() {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    notes: '',
    date: '',
    paymentMode: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/expenses', form);
      setSuccess('Expense added!');
      setForm({ amount: '', category: '', notes: '', date: '', paymentMode: '' });
      window.dispatchEvent(new Event('expenseChanged'));
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4>Add Expense</h4>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Amount (₹)</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              maxLength={100}
              placeholder="One line description"
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Payment Mode</Form.Label>
            <Form.Select name="paymentMode" value={form.paymentMode} onChange={handleChange} required>
              <option value="">Select</option>
              {paymentModes.map((mode) => (
                <option key={mode}>{mode}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={1} className="d-flex align-items-end">
          <Button type="submit" variant="primary" className="w-100">Add</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default AddExpense;