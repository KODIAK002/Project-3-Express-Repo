// Convert text to only letters and lowercase using regex
function processedString(text) {
  return String(text).match(/[a-z]/gi)?.join('').toLowerCase() || '';
}

// Check if text is a palindrome
function isPalindrome(text, processorFn) {
  const processed = processorFn(text);
  if (processed.length === 0) return false;
  return processed === processed.split('').reverse().join('');
}

module.exports = { processedString, isPalindrome };
