// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const hashEmail = (email) => {
    const hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
  };

  // Get the user's hashed email from the decoded token
  const userToken = req.headers.authorization.replace('Bearer ', '');
  const decodedToken = jwt.decode(userToken);
  const ownerId = hashEmail(decodedToken.email);

  try {
    // Retrieve all fragments for the current user
    const fragments = await Fragment.byUser(ownerId);

    // Extract only the fragment IDs from the fragments array
    const fragmentIds = fragments.map((fragment) => fragment.id);

    // Create the success response with the fragments data
    const data = createSuccessResponse({ fragments: fragmentIds || [] });

    // Send the response with the fragments data
    res.status(200).json(data);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error retrieving fragments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
