const Expense = require('../models/expense'); // Assuming you have a UserModel defined in models/user.js
const User = require('../models/user');  // Controller function to insert a new user
const DownloadReport = require('../models/download')
 
require('dotenv').config();
const s3Service = require('../services/s3Service')
const userService = require('../services/userService')
const downloadService = require('../services/downloadService');
const download = require('../models/download');

const insertExpense = async (req, res) => {
  try {
   
    const { amount, income, description, category } = req.body;
    const userId = req.user._id;

    // Create the expense document
    const expense = await Expense.create({
      amount,
      income,
      description,
      category,
      userId
    });
  
     // Find the user by userId
    const user = await User.findById(userId);
 

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's total balance
    const updatedTotal = parseInt(user.total ) + parseInt(amount);
    await user.updateOne({ total: updatedTotal });
   
    res.status(201).json('Successfully inserted' );

  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Failed to insert expense' });
  }
};

const getAllExpense = async (req, res) => {
  try {
  
    // Get expense data
    const expenseData = await userService.getExpense(req, res);

    // Get user data
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is premium
    const ispremium = user.isUserPremium === 1;

    // Send the formatted expense data and premium status as a response
    res.status(200).json({ expenseData, ispremium });
  } catch (error) {
    console.log('Error retrieving expense data:', error);
    res.status(500).json({ error: 'Failed to retrieve User data' });
  }
};

const downloadExpense = async (req, res) => {
try {
  console.log(req)
const expensesResponse = await getAllExpense(req);
// const expensesResponse = await userService.getExpense(req);
// Convert the response to a string
const stringifiedExpense = JSON.stringify(expensesResponse);
const  userId = req.user._id

const filename = `Expense${userId}/${new Date().toISOString()}.txt`;
 
const  fileURL = await s3Service.uploadToS3(stringifiedExpense, filename);

await DownloadReport.create({
  downloadlink : fileURL,
  userId: userId 

})

await  res.status(200).json({ fileURL, success: true });
} catch (error) {
console.error('Error downloading expense data:', error);
res.status(500).json({ error: 'Failed to download expense data' });
}
};

const getdownloadExpense = async (req,res) => {
  console.log(req.body)
  try {
  
    const Link_Data = await downloadService.get_link(req,res)
   console.log(Link_Data)
    res.status(200).json({Link_Data});
  } catch (error) {
    console.error('Error retrieving download data:', error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
}



 const paginatedResults = async (req,res) => {
  //const Item_Per_page = 2;
  const page = parseInt(req.query.page);
   const Item_Per_page = parseInt(req.query.perPage);

   download.findAll({
      offset: (page-1)*Item_Per_page,
      limit: Item_Per_page,
    })
.then((download) => {
  res.json({
  download: download,
  currentPage: page ,
  hasNextpage: Item_Per_page* page ,
  nextPage: page + 1,
  hasPreviouspage: page > 1,
  //lastPage: Math.ceil(totalItems/Item_Per_page),

  })
})

.catch((err) => {
console.log(err)
return  res.status(500).json({ error: 'Failed to retrieve expense data' });
})
 }


module.exports = {
  insertExpense, getAllExpense , downloadExpense, getdownloadExpense , paginatedResults,
}





