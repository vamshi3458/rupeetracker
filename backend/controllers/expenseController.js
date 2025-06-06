const Expense = require('../models/Expense');
const mongoose = require('mongoose');
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, notes, date, paymentMode } = req.body;
    const expense = new Expense({ amount, category, notes, date, paymentMode, user: req.userId });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { categories, paymentModes, dateRange } = req.query;
    let filter = { user: req.userId };

    if (categories) filter.category = { $in: categories.split(',') };
    if (paymentModes) filter.paymentMode = { $in: paymentModes.split(',') };

    if (dateRange) {
      const now = new Date();
      let fromDate;
      if (dateRange === 'this_month') {
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (dateRange === 'last_30_days') {
        fromDate = new Date(now.setDate(now.getDate() - 30));
      } else if (dateRange === 'last_90_days') {
        fromDate = new Date(now.setDate(now.getDate() - 90));
      }
      if (fromDate) filter.date = { $gte: fromDate };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, user: req.userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    const { amount, category, notes, date, paymentMode } = req.body;
    expense.amount = amount;
    expense.category = category;
    expense.notes = notes;
    expense.date = date;
    expense.paymentMode = paymentMode;
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            category: "$category"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};