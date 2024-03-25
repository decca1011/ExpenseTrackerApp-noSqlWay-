const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const router = require('./router/user');
const expenseRoutes = require('./router/expense');
const payRoutes = require('./router/purchase');
const dashboard = require('./router/dashboard');
const resetpassword = require('./router/resetpassword');
const report = require('./router/report');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

//  routes for 'post', 'get', and 'delete' here
app.use('/post', router);

app.use('/called/password', resetpassword);
app.use('/password', resetpassword);
app.use('/post/expense', expenseRoutes); // API endpoint to insert a new user
app.use('/get/expense', expenseRoutes); // API endpoint to get all users
app.use('/user', expenseRoutes); // API endpoint to perform delete and edit task on user data
app.use('/purchase', payRoutes);
app.use('/getYour', dashboard);
app.use('/get', report);

app.use((req, res) => {
    console.log('url', req.url);
    res.sendFile(path.join(__dirname, 'Public', req.url));
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
