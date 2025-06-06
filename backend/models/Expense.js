const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, enum: ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'], required: true },
  notes: { type: String, maxlength: 100 },
  date: { type: Date, required: true },
  paymentMode: { type: String, enum: ['UPI', 'Credit Card', 'Net Banking', 'Cash'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);