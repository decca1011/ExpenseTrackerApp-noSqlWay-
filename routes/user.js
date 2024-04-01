const  path = require('path');

const express = require('express');

const controller = require('../controllers/user')

 

const  router = express.Router();
 
router.post('/Data',controller.addUser)
 
router.post('/signin',  controller.getUser)



module.exports = router;

