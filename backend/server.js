const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = 'R0se7_51kaEZjZpQV0gLXCYx1ZiUrc';
const API_SECRET = 'J_2piZcTNjrVyhTpRnuZOBsOthSMAp';
const BASE_URL = 'https://api-v2.thaibulksms.com/sms';

app.post('/proxy/send-sms', async (req, res) => {
  try {
    // Log the incoming request body
    console.log('Received request body:', req.body);

    const { msisdn, message, sender } = req.body;

    // Log the extracted values
    console.log('msisdn:', msisdn);
    console.log('message:', message);
    console.log('sender:', sender);

    const response = await axios.post(
      BASE_URL,
      { msisdn, message, sender, force: 'corporate' },
      {
        auth: {
          username: API_KEY,
          password: API_SECRET,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: 'Failed to send SMS',
      error: error.response?.data || error.message,
    });
  }
});

app.listen(4001, () => {
  console.log('Proxy server is running on http://localhost:4001');
});
