const  path = require('path');

const express = require('express');

const authenticated = require('../middleware/authMiddleware')

const controller = require('../controllers/report')

const  router = express.Router();
 
 
// router.post('/report', authenticated , controller.get_your_report)

// router.post('/report', authenticated ,(req,res,next) => {
//    //console.log(req.header)
//  // console.log(req.header('Authorization'))
//  console.log(req.body)
//    res.json('sucess')
// })

module.exports = router;