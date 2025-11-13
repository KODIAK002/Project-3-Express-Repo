const mongoose = require('mongoose')

const plaindromeSchema = new mongoose.Schema({
    text: { String, trim: true },
    normalized: String,
    isPalindrome: Boolean,
    createdAt: { type: Date, default: Date.now }
    
})

const Palindrome = mongoose.model('Palindrome', plaindromeSchema)


module.exports = Palindrome