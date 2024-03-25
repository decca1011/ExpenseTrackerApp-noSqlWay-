const  path = require('path');

const express = require('express');

const controller = require('../controllers/user')

const authenticated = require('../middleware/authMiddleware')

const  router = express.Router();
 
router.post('/Data',controller.addUser)
//  router.post('/Data',(req,res) => {
//    console.log(req.body)
//  })
 
// router.post('/signin',  controller.get_User)



module.exports = router;

