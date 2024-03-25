 // controllers/edit.js
 const Expense = require('../models/expense'); // UserModel defined in models/user.js
 const User = require('../models/user')
 const sequelize = require('../utils/database');

  
 exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;

  // Start a transaction
  const t = await sequelize.transaction();

  try {
    // Find the expense by ID
    const expense = await Expense.findByPk(expenseId);

    // If the expense does not exist, return a 404 error
    if (!expense) {
      throw new Error('Expense not found');
    }

    // Find the user associated with the expense
    const user = await User.findByPk(expense.userId);

    // If the user does not exist, return a 404 error
    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's total balance
    const updatedTotal = parseInt(user.total) - parseInt(expense.Amount);
    await user.update({ total: updatedTotal }, { transaction: t });

    // Delete the expense
    await expense.destroy();

    // Commit the transaction
    await t.commit();

    // Return a 200 OK response
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    // Roll back the transaction if there is an error
    await t.rollback();

    // Log the error
    console.error('Error deleting expense:', err);

    // Return a 500 error response
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

exports.editExpense = async (req, res, next) => {
  const expenseId = req.body.expenseId;
  const updatedAmount = req.body.Amount;
  const updatedIncome = req.body.Income;
  const updatedDes = req.body.des;
  const updatedCategory = req.body.category;

  // Start a transaction
  const t = await sequelize.transaction();

  try {
    // Find the expense by ID
    const expense = await Expense.findByPk(expenseId);

    // If the expense does not exist, return a 404 error
    if (!expense) {
      throw new Error('Expense not found');
    }

    // Find the user associated with the expense
    const user = await User.findByPk(expense.userId);

    // If the user does not exist, return a 404 error
    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's total balance
    const updatedTotal = parseInt(user.total) - parseInt(expense.Amount) + parseInt(updatedAmount);
    await user.update({ total: updatedTotal }, { transaction: t });

    // Update the expense
    expense.Amount = updatedAmount;
    expense.Income = updatedIncome
    expense.des = updatedDes;
    expense.category = updatedCategory;
    await expense.save();

    // Commit the transaction
    await t.commit();

    // Return a 200 OK response with the updated expense
    res.status(200).json(expense);
  } catch (err) {
    // Roll back the transaction if there is an error
    await t.rollback();

    // Log the error
    console.error('Error updating expense:', err);

    // Return a 500 error response
    res.status(500).json({ error: 'Failed to update expense' });
  }
};


 



