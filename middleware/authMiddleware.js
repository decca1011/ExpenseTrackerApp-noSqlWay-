const jwt = require('jsonwebtoken');
const User = require('../models/user');  
const JWT_SECRET = process.env.JWT_SECRET; 


const authenticate = async (req, res, next) => {
  try {
    // console.log(req.header('Authorization'));
   
    const customAuthorizationHeader = req.header('Authorization');

    // console.log(customAuthorizationHeader);
    if (!customAuthorizationHeader || !customAuthorizationHeader.startsWith('Bearer')   ) {
      
      console.log('failed')
      return res.status(401).json({ message: 'Authentication failed: Token not provided' });
    }
 // Extract the token part from the custom header format
const token = customAuthorizationHeader.split(' ')[1];

 
// Verify and decode the token as before
const decodedToken = jwt.verify(token, JWT_SECRET); // Replace '' with your actual secret key

// Ensure the user is found in the database
const foundUser = await User.findById(decodedToken.userId);
 

    if (!foundUser) {
      console.log('failed user not found')
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    
   req.user = foundUser;
 
  next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false });
  }
};

module.exports = {authenticate};