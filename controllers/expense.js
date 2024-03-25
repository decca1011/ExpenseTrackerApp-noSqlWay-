const ExpenseModel = require('../models/expense'); // Assuming you have a UserModel defined in models/user.js
const User = require('../models/userData');  // Controller function to insert a new user
const DownloadReport = require('../models/download')
const sequelize = require('../util/database'); 
require('dotenv').config();
const S3Service = require('../service/S3service')
const UserService = require('../service/userservices')
const Download_Service = require('../service/Download_link');
const download = require('../models/download');


const insertExpense = async (req, res) => {
const t = await sequelize.transaction();
  try {
  const Amount =req.body.Amount;
  const Income = req.body.Income 
  const des =req.body.des;
  const category = req.body.category;
  const userId = req.user.id;

  // Use UserModel.create function to insert the user into the database
  const create_Expense = await ExpenseModel.create(
            {
              Amount : Amount,
              Income: Income,
              des: des,
              category: category,
              userId: userId 
            },
              {transaction: t})

  const user = await User.findByPk(userId)
  // Update the user's total balance

  if (!user) {
  await t.rollback();
  return res.status(404).json({ error: 'User not found' });

  }

  // Update the user's total balance
  const updatedTotal = parseInt(user.total) + parseInt(Amount)
  await user.update({ total: updatedTotal}, {transaction: t});
  
  await t.commit();
  res.status(201).json('sucessfully inserted'); 

 }  catch (err) {
  await t.rollback();
  console.error('Error inserting  DAta:', err);
  res.status(500).json({ err: 'Failed to insert Expense'})
 }
}

const getAllExpense = async (req, res) => {
  try {
    const expenseData = await UserService.getExpense(req,res) 
    // Fetch user data (if needed)
    const user = await User.findByPk(req.user.id); 
    var ispremium = user.isUserPremeuim ;
    if(ispremium == 0){
      ispremium = false;
    }
    else {
      ispremium = true;
    }
 

    // Send the formatted expense data as a response
   
    res.status(200).json({expenseData,ispremium});
  } catch (error) {
    console.error('Error retrieving expense data:', error);
   return  res.status(500).json({ error: 'Failed to retrieve User data' });
  }
};


const downloadExpense = async (req, res) => {
try {
// const expensesResponse = await getAllExpense(req);
const expensesResponse = await UserService.getExpense(req);
// Convert the response to a string
const strinfiedExpense = JSON.stringify(expensesResponse);
const  userId = req.user.id

const filename = `Expense${userId}/${new Date().toISOString()}.txt`;
 
const  fileURL = await S3Service.uploadToS3(strinfiedExpense, filename);

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
  
    const Link_Data = await Download_Service.get_link(req,res)
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





