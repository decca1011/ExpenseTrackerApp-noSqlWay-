 // controllers/edit.js
 const Expense = require('../models/expense'); // UserModel defined in models/user.js
 const User = require('../models/user')
 

 const deleteExpense = async (req, res) => {
  console.log(req.params)
  const expenseId = req.params.expenseId;
  
  try {
      // Find the expense by ID
      const expense = await Expense.findById(expenseId);
      const deleteExpense = await Expense.findByIdAndDelete(expenseId);

      // If the expense does not exist, return a 404 error
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      // Extract user ID from the expense
      const userId = expense.userId;
     // Find the user by ID
     const user = await User.findById(userId);
     
    // If the expense does not exist, return a 404 error
    if (!deleteExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

 

    // If the user does not exist, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's total balance
    user.total -= expense.amount;
    await user.save();

    // Return a 200 OK response
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    // Log the error
    console.error('Error deleting expense:', err);

    // Return a 500 error response
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};


 
const editExpense = async (req, res) => {
  const expenseId = req.body.expenseId;
  const updatedAmount = req.body.amount;
  const updatedIncome = req.body.income;
  const updatedDes = req.body.description;
  const updatedCategory = req.body.category;

  try {
    // Find the expense by ID
    const expense = await Expense.findById(expenseId);

    // If the expense does not exist, return a 404 error
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Find the user associated with the expense
    const user = await User.findById(expense.userId);

    // If the user does not exist, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's total balance
    const updatedTotal = parseInt(user.total) - parseInt(expense.amount) + parseInt(updatedAmount);
    await User.findByIdAndUpdate(user._id, { total: updatedTotal });

    // Update the expense
    await Expense.findByIdAndUpdate(expenseId, {
      amount: updatedAmount,
      income: updatedIncome,
      description: updatedDes,
      category: updatedCategory
    });

  
    // Return a 200 OK response with the updated expense
    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (err) {
    // Log the error
    console.error('Error updating expense:', err);

    // Return a 500 error response
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

 


module.exports = {
deleteExpense, editExpense
}