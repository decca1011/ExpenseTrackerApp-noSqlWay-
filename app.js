const path = require('path');
const fs = require('fs');
const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
  res.cookie('cookieName', 'cookieValue', {
    sameSite: 'none',
    secure: true,
  });
  res.send('Cookie set successfully!');
});


const mongoose = require('mongoose');
 
 
const routes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const payRoutes = require('./routes/purchase');
const dashboard = require('./routes/dashboard');
const resetpassword = require('./routes/resetpassword');
const report = require('./routes/report');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

//  routes for 'post', 'get', and 'delete' here
app.use('/post', routes);

app.use('/called/password', resetpassword);
app.use('/password', resetpassword);

app.use('/post/expense', expenseRoutes); // API endpoint to insert a new user
app.use('/get/expense', expenseRoutes); // API endpoint to get all users
app.use('/user', expenseRoutes); // API endpoint to perform delete and edit task on user data
app.use('/purchase', payRoutes);
// app.post('/purchase/updatetransactionstatus', (req) => {
//     console.log('hello')})

app.use('/getYour', dashboard);
app.use('/get', report);

app.use((req, res, next) => {
    res.setHeader('Set-Cookie', 'SameSite=None; Secure');
    next();
  });
app.use((req, res) => {
    console.log('url', req.url);
    res.sendFile(path.join(__dirname, 'public', req.url));
});

  
mongoose
    .connect(
      'mongodb+srv://deepakpatil101197:A8a0CB13lgVKMYrY@cluster0.psuxcmr.mongodb.net/'
    )
    .then(result => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.log(err);
    });
