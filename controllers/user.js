const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Import the dotenv library
dotenv.config(); // Load environment variables from .env file
const JWT_SECRET = process.env.JWT_SECRET; //
const bcrypt = require('bcrypt')
const User = require('../models/user');


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
      isPremium: false
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
 
 
exports.getUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = generateToken(user._id, user.username, user.email); // Assuming you have a function named generatToken for generating tokens

        res.status(200).json({
          success: true,
          message: 'User login successful',
          token: token
        });
      } else {
        console.log("User not authorized");
        res.status(401).json({ success: false, message: 'User not authorized' });
      }
    } else {
      console.log("User not found");
      res.status(401).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};