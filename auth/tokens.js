const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/createtoken', (req, res) => {
  const user = {
    _id: 1,
    username: 'test',
    password: 'test',
  };

  // Create a token using the sign method
  const token = jwt.sign({ user }, process.env.PROJECT_SECRET);

  // Send the token back to the client
  res.json({ token });
});


router.post('/checktoken', (req, res) => {
  //use bearer token
  //make sure if using postman to not have quotes around the token!!
try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.PROJECT_SECRET); //verification

    res.json({ decoded });
  } catch (err) {
    res.status(401).json({ err: 'Invalid token.' });
  }
});


module.exports = router;
