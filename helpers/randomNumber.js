const crypto = require('crypto');

function generateRandomNumber() {
  const randomNumber = BigInt(`0x${crypto.randomBytes(8).toString('hex')}`);
  return randomNumber.toString().padStart(16, '0').slice(0, 16);
}

module.exports = {
  generateRandomNumber
};
