import React from 'react';
import AddExpense from '../components/AddExpense';
import ExpenseList from '../components/ExpenseList';

function Home() {
  return (
    <div className="container mt-4">
      <AddExpense />
      <hr />
      <ExpenseList />
    </div>
  );
}

export default Home;