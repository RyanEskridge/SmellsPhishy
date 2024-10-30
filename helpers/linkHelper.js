const axios = require('axios');
require('dotenv').config();

async function createLink(long_url, group_guid = '', domain = 'bit.ly') {
  try {
    const response = await axios.post('https://api-ssl.bitly.com/v4/shorten', {
      long_url,
      group_guid,
      domain
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.BITLY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.link;
  } catch (error) {
    console.error('Error creating link:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { createLink };