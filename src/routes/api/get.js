// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const crypto = require('crypto');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const hashEmail = (email) => {
      const hash = crypto.createHash('sha256');
      hash.update(email);
      return hash.digest('hex');
    };

    const email = hashEmail(req.user);
    // Retrieve all fragments for the current user
    const fragments = await Fragment.byUser(email);

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

module.exports.expand = async (req, res) => {
  try {
    const hashEmail = (email) => {
      const hash = crypto.createHash('sha256');
      hash.update(email);
      return hash.digest('hex');
    };

    const email = hashEmail(req.user);

    const fragments = await Fragment.byUser(email);

    const data = createSuccessResponse({ fragments: fragments || [] });
    res.status(200).json(data);
  }
  catch (err) {
    res.status(500);
  }
}

module.exports.getFragmentById = async (req, res) => {
  try {
    res.status(200);
  }
  catch (err) {
    res.status(500);
  }
}
