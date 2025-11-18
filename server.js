const express = require('express'); // import express server library
const dotenv = require('dotenv'); // import dotenv to read .env config
dotenv.config(); // load environment variables into process.env
const mongoose = require('mongoose'); // import mongoose for MongoDB access
const cors = require('cors'); // import cors to allow cross-origin requests
const app = express(); // create the express application instance
const logger = require('morgan');

const palindromeRouter = require('./routes/palindromeRoutes.js'); // import palindrome routes that use the shared schema
const authRouter = require('./auth/tokens.js');
const userAuth = require('./auth/login.js');

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

const port = process.env.PORT ? process.env.PORT : '3000'; // choose provided port or fall back to 3000

//CONNECTS TO DATABASE USING VARIABLE HOLDS THE LOGIN INFO TO CONNECT TO MONGODB DATABASE AND WILL OUTPUT A MESSAEGE SAYING THE DATABASE YOU ARE CONNECTED TO
if (!process.env.MONGODB_URI) { // guard to ensure the Mongo connection string exists
  console.error('Missing MONGODB_URI in .env — cannot start server without DB connection string.'); // log why the server stops
  process.exit(1); // exit early so nodemon reports the misconfiguration
}

mongoose.connect(process.env.MONGODB_URI); // open a connection using the shared connection string
// log connection status to terminal on start
mongoose.connection.on('connected', () => { // listen for successful Mongo connection events
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`); // confirm database name in the console
});

mongoose.connection.on('error', (err) => { // surface connection errors for easier debugging
  console.error('MongoDB connection error:', err.message); // log the failure reason
});

app.use(cors()); // enable cross-origin requests (needed for separate React frontend)
app.use(express.json()); // register JSON body parsing middleware

app.use('/auth', authRouter);
app.use('/user', userAuth);
app.use('/palindrome', palindromeRouter); // mount the palindrome router on its base path

app.listen(port, () => { // start listening for HTTP requests
  console.log(`The express app is ready on port ${port}!`); // confirm which port is active
});
