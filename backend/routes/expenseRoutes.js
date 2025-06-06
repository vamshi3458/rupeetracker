const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addExpense, getExpenses, editExpense, deleteExpense, getAnalytics } = require('../controllers/expenseController');

router.use(auth);

router.post('/', addExpense);
router.get('/', getExpenses);
router.get('/analytics', getAnalytics);
router.put('/:id', editExpense);
router.delete('/:id', deleteExpense);

module.exports = router;