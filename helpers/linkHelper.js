const axios = require('axios');
require('dotenv').config();

const LINKLY_API_URL = 'https://api.linkly.com/v1/links';
const API_KEY = process.env.LINKLY_API_KEY; // Load API key from .env file

/**
 * Creates a link using the Linkly API.
 * @param {string} url - The URL to be shortened.
 * @param {string} title - The title for the link.
 * @returns {Promise<Object>} - The response from the Linkly API.
 */
async function createLink(url, title) {
    try {
        const response = await axios.post(LINKLY_API_URL, {
            url: url,
            title: title
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating link:', error);
        throw error;
    }
}

module.exports = {
    createLink
};