const Expense = require('../models/expense'); // Assuming you have a Mongoose Expense model defined

const getExpense = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;
    
    const expenses = await Expense.find({ userId: req.user._id })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select('id amount income description category');
      
    // Map the expenses to a desired format
    const expenseData = expenses.map(expense => ({
      id: expense._id,
      amount: parseInt(expense.amount),
      income: parseFloat(expense.income),
      description: expense.description,
      category: expense.category,
    }));
 
    return expenseData;
  } catch (err) {
   return console.error('Error retrieving expense data:', err);
    
  }
}

module.exports = {
  getExpense
}
