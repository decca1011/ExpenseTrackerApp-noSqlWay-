 
const path = require('path');

const express = require('express');

const router = express.Router();

const userExpense = require('../controllers/expense');

const editController = require('../controllers/edit');

const authenticated = require('../middleware/authMiddleware')

// // POST request to insert a new user
// router.post('/', authenticated, userExpense.insertExpense);
 
// // GET request to retrieve all users
// router.get('/' , authenticated,userExpense.getAllExpense);

// router.delete('/:expenseId', editController.deleteExpense);
 
// router.post('/edit',  editController.editExpense);
 
// router.get('/download' , authenticated ,userExpense.downloadExpense)
// //router.get('/downloadlink' , authenticated ,userExpense.getdownloadExpense)
// // get paginated results
 
// router.get('/downloadlink',authenticated , userExpense.paginatedResults)
 

module.exports = router;


