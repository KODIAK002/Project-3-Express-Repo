const express = require('express');
const mongoose = require('mongoose');
const Palindrome = require('../models/palindrome.js')
const { processedString, isPalindrome } = require('../utils/palindrome.js');

const router = express.Router();

// Validate Mongo ObjectId
const validateId = (id) => mongoose.Types.ObjectId.isValid(id);

// ---------------------------
// GET: /palindromes
// ---------------------------
router.get('/', async (req, res) => {
  try {
    const palindromes = await Palindrome.find().sort({ createdAt: -1 });
    res.json(palindromes);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch palindromes', error: error.message });
  }
});


// ---------------------------
// POST: /palindromes
// ---------------------------
router.post('/palindrome', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'A text string is required' });
  }


  try {
    const normalized = processedString(text);
    const palindromeFlag = isPalindrome(text, processedString);



    const palindrome = await Palindrome.create({
      text,
      normalized,
      isPalindrome: palindromeFlag,
      description: req.body.description,
    });

    res.status(201).json(palindrome);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create palindrome', error: error.message });
  }
});

// ---------------------------
// GET: /palindromes/:id
// ---------------------------
router.get('/palindrome/:id', async (req, res) => {
  const { id } = req.params;

  if (!validateId(id)) return res.status(400).json({ message: 'Invalid palindrome id' });

  try {
    const palindrome = await Palindrome.findById(id);
    if (!palindrome) return res.status(404).json({ message: 'Palindrome not found' });
    res.json(palindrome);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch palindrome', error: error.message });
  }
});


// ---------------------------
// PATCH: /palindromes/:id
// ---------------------------
router.patch('palindrome/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!validateId(id)) return res.status(400).json({ message: 'Invalid palindrome id' });
  if (!text || typeof text !== 'string') return res.status(400).json({ message: 'A text string is required' });

  try {
    const normalized = processedString(text);
    const palindromeFlag = isPalindrome(text, processedString);

    const updated = await Palindrome.findByIdAndUpdate(
      id,
      { text, normalized, isPalindrome: palindromeFlag },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Palindrome not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update palindrome', error: error.message });
  }
});

// ---------------------------
// DELETE: /palindromes/:id
// ---------------------------
router.delete('/palindrome/:id', async (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) return res.status(400).json({ message: 'Invalid palindrome id' });

  try {
    const deleted = await Palindrome.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Palindrome not found' });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete palindrome', error: error.message });
  }
});

// ---------------------------
// POST: /palindromes/check
// ---------------------------
router.post('/palindrome/check', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') return res.status(400).json({ message: 'A text string is required' });

  const normalized = processedString(text);
  const palindromeFlag = isPalindrome(text, processedString);

  res.json({ text, normalized, isPalindrome: palindromeFlag });
});

module.exports = router;
