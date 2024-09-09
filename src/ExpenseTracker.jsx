import React, { useState } from 'react'
import './ExpenseTracker.css'

function ExpenseTracker() {
    const [input, setInput] = useState('');
    const [amount, setAmount] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    
  
    function addExpense(){
      if(!input || !amount) return;
        const newExpense = {
          id: Date.now(),
          title: input,
          amount: parseFloat(amount)
        }
        // console.log(newExpense);
        setTotalAmount(newExpense.amount + totalAmount);
        setExpenses([...expenses, newExpense]);
        console.log(newExpense.id);
        setInput('');
        setAmount('');
        
    }
    
    const deleteExpense = id => {
        const deletedExpense = expenses.find(expense => expense.id === id);
        if(!deleteExpense) return;
        const editableExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(editableExpenses);
        setTotalAmount(totalAmount - deletedExpense.amount);
        console.log(deletedExpense);
    }

  return (
    <div className='container'>
      <h2>Expense Tracker</h2>
      <div className='input-container'>
        <input type='text'
        placeholder='Expense...'
        value={input}
        onChange={e => setInput(e.target.value)}
        />
        <input type='number'
        placeholder='Amount...'
        value={amount}
        onChange={e => setAmount(e.target.value)}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>
      <div className='display'>
          <ul className='expense-list'>
            {
              expenses.map(expense => (
                <li key={expense.id} >
                  <span>{expense.title}</span>
                  <span className='amt' style={{fontWeight: 'bold'}}>{expense.amount}</span>
                  <button onClick={() => deleteExpense(expense.id)}
                  >Delete</button>
                </li>
              ))
            }
          </ul>
      </div>
      <div className="total">
        <h3>Total Amount: {totalAmount}</h3>
      </div>
    </div>
  )
}

export default ExpenseTracker
