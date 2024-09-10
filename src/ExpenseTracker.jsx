import React, { useEffect, useState } from 'react'
import './ExpenseTracker.css'

function ExpenseTracker() {
    const [input, setInput] = useState('');
    const [amount, setAmount] = useState(null);
    const [category, setCategory] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [income, setIncome] = useState(0);
    const [editInput, setEditInput] = useState('');
    const [editAmount, setEditAmount] = useState(null);
    const [editCategory, setEditCategory] = useState('');
    const [idToBeEdited, setIdToBeEdited] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    
    useEffect(() => {
      const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
      const storedTotalAmount = parseInt(localStorage.getItem('totalAmount'), 10) || 0;
      const storedIncome = parseInt(localStorage.getItem('income'), 10) || 0;
      if(storedTotalAmount < 0) storedTotalAmount = 0;
      setExpenses(storedExpenses);
      setTotalAmount(storedTotalAmount);
      setIncome(storedIncome);
      if(storedTotalAmount === 0 || storedIncome <= 0){
        let userInput = parseFloat(prompt('Enter your Income to Analyse your Expense'));
        // console.log(userInput);
        if(!isNaN(userInput) && parseFloat(userInput) > 0){
          while(userInput < storedTotalAmount){
            userInput = parseFloat(prompt(`Income must be greater than total expense ${storedTotalAmount}. Please enter again:`));
          }
          setIncome(parseFloat(userInput));
        }
        else{
          alert("Enter a Valid Income Amount, Please");
        }
      }

    },[]);

    useEffect(() => {
      localStorage.setItem('expenses', JSON.stringify(expenses));
      localStorage.setItem('totalAmount', totalAmount.toString());
      localStorage.setItem('income', income.toString());
    }, [expenses, totalAmount, income]);

    function addExpense(){
      if(!input || !amount || !category || isNaN(amount) || parseFloat(amount) <= 0){
        alert('Fill all the Credentials Correctly Please')
        return;
      } 
      if(income - totalAmount < amount){
        alert('Expense Exceded your Income');
        return;
      }
      const newExpense = {
        id: Date.now(),
        title: input,
        amount: parseFloat(amount),
        category: category,
        date: new Date().toLocaleDateString()
      }
      // console.log(newExpense);
      setTotalAmount(newExpense.amount + totalAmount);
      setExpenses([...expenses, newExpense]);
      console.log(newExpense.id);
      setInput('');
      setAmount('');
      setCategory('');
        
    }
    
    const deleteExpense = id => {
        const deletedExpense = expenses.find(expense => expense.id === id);
        if(!deletedExpense) return;
        const editableExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(editableExpenses);
        setTotalAmount(totalAmount - deletedExpense.amount);
        console.log(deletedExpense);
    }

    function handleKeyPress(e) {
      if(e.key === 'Enter'){
        addExpense();
      }
      // console.log(e.key);
    }

    function saveEditedData (){
      // console.log(typeof editAmount);

      if(!editAmount || isNaN(editAmount) || parseFloat(editAmount) < 0){
        alert('Update the Correct Amount Please');
        return;
      }

      const updatedExpenses = expenses.map((expense) => {
        if(expense.id === idToBeEdited){
          const updatedExpense = {
            ...expense,
            title: editInput,
            amount: parseFloat(editAmount),
            category: editCategory
          };
          if(totalAmount - expense.amount + updatedExpense.amount > income){
            alert('Expense Exceded your Income');
            return expense;
          }
          else{
            
            setTotalAmount(prev => prev - expense.amount + updatedExpense.amount);
            return updatedExpense;
          }
        }
        return expense;
        });
        setExpenses(updatedExpenses);
        setIdToBeEdited(null);
        setEditAmount(null);
        setEditCategory('');
        setEditInput('');
      }
    function editData(id){
      const expenseToEdit = expenses.find(expense => expense.id === id);
      setIdToBeEdited(id);
      setEditInput(expenseToEdit.title);
      setEditAmount(expenseToEdit.amount);
      setEditCategory(expenseToEdit.category);
    }

  return (
    <div className='container'>
      <h1>Expense Manager</h1>
      <div className='input-container'>
        <input type='text'
        placeholder='Expense'
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        />
        <select value={category} 
        onChange={(e) => setCategory(e.target.value)} 
        className="category"
        onKeyDown={handleKeyPress}
          >
          <option value='' >Select Category</option>
          <option value='Food' >Food</option>
          <option value='Travel' >Travel</option>
          <option value='Shopping' >Shopping</option>
        </select>
        <input type='number'
        placeholder='Amount'
        value={amount}
        onChange={e => setAmount(e.target.value)}
        onKeyDown={handleKeyPress}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>

        <select value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)} 
        className="filter-category"
        onKeyDown={handleKeyPress}
          >
          <option value='' >Filter Category</option>
          <option value='Food' >Food</option>
          <option value='Travel' >Travel</option>
          <option value='Shopping' >Shopping</option>
          {/* <option value='add-category' >Shopping</option> */}
        </select>

      <div className='display'>
          <ul className='expense-list'>
            {
              expenses
              .filter(expense => categoryFilter === '' || categoryFilter === expense.category)
              .map(expense => (
                <li key={expense.id} >
                  
                    {
                    (idToBeEdited === expense.id) ?
                    <>
                      <input
                      type='text'
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      />

                      <input
                      type='number'
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      />

                      <select 
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      >
                        <option value='' >Select Category</option>
                        <option value='Food' >Food</option>
                        <option value='Travel' >Travel</option>
                        <option value='Shopping' >Shopping</option>
                      </select>
                    </> :
                    <>
                      <span>{expense.title}</span>
                      <span className='amt' style={{fontWeight: 'bold'}}>{expense.amount}</span>
                      <span className='display-category'>{expense.category}</span>
                    </>
                    }

                   { (expense.id === idToBeEdited) ?
                  <button onClick={saveEditedData} className='save btn' >Save</button> :
                  <button onClick={() => editData(expense.id)} className='edit btn'>Edit</button> }

                  <button onClick={() => deleteExpense(expense.id)}
                  >Delete</button>
                </li>
              ))
            }
          </ul>
      </div>
      <div className="total">
        <h2>Total Amount: {totalAmount}</h2>
        <h2>Savings: {income - totalAmount}</h2>
      </div>
    </div>
  )
}
export default ExpenseTracker
