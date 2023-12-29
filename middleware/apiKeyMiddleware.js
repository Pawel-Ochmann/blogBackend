require('dotenv').config();

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized - Invalid API Key' });
  }

  // If the API key is valid, proceed to the next middleware or route handler
  next();
};

module.exports = validateApiKey;
