const Palindrome = require('./models/palindrome.js')
const { processedString, isPalindrome } = require('./utils/palindrome.js');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT ? process.env.PORT : "3000";

//CONNECTS TO DATABASE USING VARIABLE HOLDS THE LOGIN INFO TO CONNECT TO MONGODB DATABASE AND WILL OUTPUT A MESSAEGE SAYING THE DATABASE YOU ARE CONNECTED TO
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
