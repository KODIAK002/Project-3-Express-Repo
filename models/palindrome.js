const mongoose = require('mongoose')

const palindromeSchema = new mongoose.Schema({
    text: { type: String, trim: true },
    normalized: String,
    isPalindrome: Boolean,
    createdAt: { type: Date, default: Date.now }
    
})

const Palindrome = mongoose.model('Palindrome', palindromeSchema)


module.exports = Palindrome