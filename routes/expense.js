 
 

const express = require('express');

const router = express.Router();
const editController = require('../controllers/edit');

const userExpense = require('../controllers/expense');

const authenticated = require('../middleware/authMiddleware.js')

// POST request to insert a new user
// router.post('/', (req,res) => {
//    console.log(req.body);  //logs the data sent from client
//    console.log(req.header('Authorization'));
// });

router.post('/', authenticated.authenticate , userExpense.insertExpense);
 
// GET request to retrieve all users
router.get('/' , authenticated.authenticate, userExpense.getAllExpense);
 
router.delete('/:expenseId', editController.deleteExpense);
 
router.post('/edit',  editController.editExpense);
 
router.get('/download' , authenticated.authenticate ,userExpense.downloadExpense)

// router.get('/downloadlink' , authenticated ,userExpense.getdownloadExpense)

// get paginated results
 
// router.get('/downloadlink',authenticated , userExpense.paginatedResults)
 

module.exports = router;


