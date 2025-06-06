import React, { useEffect, useState } from 'react';
import { Table, Form, Row, Col, Badge, Button, Modal } from 'react-bootstrap';
import axios from '../utils/axiosInstance';

const categories = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'];
const paymentModes = ['UPI', 'Credit Card', 'Net Banking', 'Cash'];
const dateRanges = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'Last 90 Days', value: 'last_90_days' },
  { label: 'All Time', value: '' }
];

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    paymentModes: [],
    dateRange: ''
  });
  const [editExpense, setEditExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchExpenses = async () => {
    let params = {};
    if (filters.categories.length) params.categories = filters.categories.join(',');
    if (filters.paymentModes.length) params.paymentModes = filters.paymentModes.join(',');
    if (filters.dateRange) params.dateRange = filters.dateRange;
    const res = await axios.get('/expenses', { params });
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
    window.addEventListener('expenseChanged', fetchExpenses);
    return () => window.removeEventListener('expenseChanged', fetchExpenses);
    // eslint-disable-next-line
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setFilters((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((v) => v !== value)
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await axios.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  const handleEdit = (expense) => {
    setEditExpense({ ...expense, date: expense.date.slice(0, 10) });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setEditExpense({ ...editExpense, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/expenses/${editExpense._id}`, editExpense);
    setShowModal(false);
    fetchExpenses();
  };

  return (
    <>
      <h4>Expenses</h4>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Category</Form.Label>
          {categories.map((cat) => (
            <Form.Check
              key={cat}
              type="checkbox"
              label={cat}
              name="categories"
              value={cat}
              checked={filters.categories.includes(cat)}
              onChange={handleFilterChange}
            />
          ))}
        </Col>
        <Col md={3}>
          <Form.Label>Payment Mode</Form.Label>
          {paymentModes.map((mode) => (
            <Form.Check
              key={mode}
              type="checkbox"
              label={mode}
              name="paymentModes"
              value={mode}
              checked={filters.paymentModes.includes(mode)}
              onChange={handleFilterChange}
            />
          ))}
        </Col>
        <Col md={3}>
          <Form.Label>Date Range</Form.Label>
          <Form.Select name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
            {dateRanges.map((dr) => (
              <option key={dr.value} value={dr.value}>{dr.label}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount (₹)</th>
            <th>Category</th>
            <th>Notes</th>
            <th>Payment Mode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td><Badge bg="success">{exp.amount}</Badge></td>
              <td>{exp.category}</td>
              <td>{exp.notes}</td>
              <td>{exp.paymentMode}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(exp)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(exp._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Expense</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Amount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={editExpense?.amount || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={editExpense?.category || ''} onChange={handleEditChange} required>
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={editExpense?.date || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Payment Mode</Form.Label>
                  <Form.Select name="paymentMode" value={editExpense?.paymentMode || ''} onChange={handleEditChange} required>
                    <option value="">Select</option>
                    {paymentModes.map((mode) => (
                      <option key={mode}>{mode}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-2">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                type="text"
                name="notes"
                value={editExpense?.notes || ''}
                onChange={handleEditChange}
                maxLength={100}
                placeholder="One line description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ExpenseList;