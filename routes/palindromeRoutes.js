const express = require('express'); // import express to build router
const mongoose = require('mongoose'); // import mongoose utilities for validation
const Palindrome = require('../models/palindrome'); // pull in the shared palindrome schema/model

const router = express.Router(); // create an isolated router instance

const normalizeText = (text = '') => text.toLowerCase().replace(/[^a-z0-9]/g, ''); // helper to strip non-alphanumerics and lowercase

const calcPalindromeData = (text) => { // compute normalized text and palindrome status
  const normalized = normalizeText(text); // derive normalized version
  const reversed = normalized.split('').reverse().join(''); // reverse normalized string
  return { normalized, isPalindrome: normalized === reversed }; // report normalized text and comparison result
}; // close helper

const validateId = (id) => mongoose.Types.ObjectId.isValid(id); // confirm Mongo ObjectId format

router.get('/', async (req, res) => { // list every palindrome document
  try { // attempt DB read
    const palindromes = await Palindrome.find().sort({ createdAt: -1 }); // fetch newest first
    res.json(palindromes); // send data to client
  } catch (error) { // handle database failures
    res.status(500).json({ message: 'Unable to fetch palindromes', error: error.message }); // report internal error
  } // close catch
}); // end handler

router.get('/:id', async (req, res) => { // fetch single palindrome by id
  const { id } = req.params; // read id from params

  if (!validateId(id)) { // ensure id format is valid
    return res.status(400).json({ message: 'Invalid palindrome id' }); // short-circuit on invalid id
  } // continue on valid id

  try { // attempt lookup
    const palindrome = await Palindrome.findById(id); // query Mongo by id
    if (!palindrome) { // handle missing document
      return res.status(404).json({ message: 'Palindrome not found' }); // send not-found response
    } // continue when found
    res.json(palindrome); // send document json
  } catch (error) { // catch DB errors
    res.status(500).json({ message: 'Unable to fetch palindrome', error: error.message }); // send failure message
  } // close catch
}); // end handler

router.post('/', async (req, res) => { // create new palindrome record
  const { text } = req.body; // read payload text

  if (!text || typeof text !== 'string') { // validate incoming text
    return res.status(400).json({ message: 'A text string is required' }); // fail when invalid
  } // continue when valid

  try { // attempt insert
    const { normalized, isPalindrome } = calcPalindromeData(text); // derive normalized data
    const palindrome = await Palindrome.create({ text, normalized, isPalindrome }); // persist document
    res.status(201).json(palindrome); // respond with created record
  } catch (error) { // catch insert issues
    res.status(500).json({ message: 'Unable to create palindrome', error: error.message }); // signal failure
  } // close catch
}); // end handler

router.patch('/:id', async (req, res) => { // update an existing palindrome
  const { id } = req.params; // extract id parameter
  const { text } = req.body; // extract updated text

  if (!validateId(id)) { // ensure id is valid
    return res.status(400).json({ message: 'Invalid palindrome id' }); // return validation error
  } // continue if valid

  try { // attempt update
    const update = {}; // prepare mutation object

    if (typeof text === 'string') { // only update fields when text provided
      const { normalized, isPalindrome } = calcPalindromeData(text); // recompute derived fields
      Object.assign(update, { text, normalized, isPalindrome }); // merge computed values into payload
    } // skip if no string provided

    if (!Object.keys(update).length) { // ensure at least one field to change
      return res.status(400).json({ message: 'Provide at least one field to update' }); // guard empty updates
    } // continue otherwise

    const palindrome = await Palindrome.findByIdAndUpdate(id, update, { // run Mongo update
      new: true, // return the updated document
      runValidators: true, // enforce schema validation on update
    }); // close options

    if (!palindrome) { // handle missing document
      return res.status(404).json({ message: 'Palindrome not found' }); // return not found
    } // continue when found

    res.json(palindrome); // send updated document
  } catch (error) { // catch errors
    res.status(500).json({ message: 'Unable to update palindrome', error: error.message }); // return server error
  } // close catch
}); // end handler

router.delete('/:id', async (req, res) => { // delete a palindrome by id
  const { id } = req.params; // read id

  if (!validateId(id)) { // validate id format
    return res.status(400).json({ message: 'Invalid palindrome id' }); // error when invalid
  } // continue otherwise

  try { // attempt deletion
    const palindrome = await Palindrome.findByIdAndDelete(id); // remove document
    if (!palindrome) { // handle missing document
      return res.status(404).json({ message: 'Palindrome not found' }); // signal not found
    } // continue when removed
    res.status(204).send(); // send no-content success
  } catch (error) { // catch deletion failures
    res.status(500).json({ message: 'Unable to delete palindrome', error: error.message }); // report error
  } // close catch
}); // end handler

router.post('/check', (req, res) => { // helper endpoint to test strings
  const { text } = req.body; // read input text

  if (!text || typeof text !== 'string') { // validate provided text
    return res.status(400).json({ message: 'A text string is required' }); // reject invalid input
  } // continue otherwise

  const result = calcPalindromeData(text); // compute palindrome metadata
  res.json(result); // return computed result without DB writes
}); // end handler

module.exports = router; // export router for server.js
