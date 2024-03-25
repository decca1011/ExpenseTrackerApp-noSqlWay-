const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Import the dotenv library
dotenv.config(); // Load environment variables from .env file
const JWT_SECRET = process.env.JWT_SECRET; //
const bcrypt = require('bcrypt')
const User = require('../models/userData');


function generateToken(id, name, email) {
  console.log(email);
  return jwt.sign({ userId: id, name: name, email: email }, JWT_SECRET);
}

// Function to add a user
exports.addUser = async (req, res, next) => {
  try {
    // Get user data from the request body
    const { username, email, password, mobile } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Create the user document
    const user = new User({
      name:username,
      email:email,
      password: hash,
      mobile:mobile,
    });

    // Save the user document to the database
    await user.save();

    // Generate a token for the user
    const token = generateToken(user.id, user.name, user.email);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    // Handle errors
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Failed to add user' });
  }
};
 
exports.get_User = async (req, res) => {   
 const {  email, password} = req.body;
//  console.log(password)
 
  try {
    const user = await User.findOne({where: {email: email} })
       // Find a user with the provided email and password
       if(user)
       {
          const passwordMatch = await bcrypt.compare(password , user.password);
//  console.log(password, passwordMatch)
          if(passwordMatch){
 
      
      const token = generatToken(user.id,user.username, user.email)
 
           res.status(200).json({ 
             success: true, message: 
             'User login sucessful' , token: token});
             
 
          }
    
 
         else {
          console.log("user not authorized)",)
          res.status(401).json({ success: false, message: 'User not authorized)' });
         }
        }
      else {
        console.log("user not found)",user)
        res.status(401).json({ success: false, message: 'User not found)' });
      }
    
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
};
