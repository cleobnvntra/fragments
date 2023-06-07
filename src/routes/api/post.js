const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const hashEmail = (email) => {
    const hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
  };

  try {
    // Extract the file data from the request body
    const content = req.body;
    const userToken = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(userToken);

    // Extract the Content-Type header from the request
    const contentType = req.get('Content-Type');

    // Generate a new fragment ID using a UUID
    const fragmentId = crypto.randomUUID();

    // Generate the ownerId by hashing the username
    const ownerId = hashEmail(decodedToken.email);

    // Get the current timestamp for created and updated fields
    const timestamp = new Date().toISOString();

    // Calculate the size of the file data in bytes
    const size = Buffer.byteLength(content);

    // Create a new instance of the Fragment class
    const fragmentData = {
      id: fragmentId,
      ownerId: ownerId,
      created: timestamp,
      updated: timestamp,
      type: contentType,
      size: size,
    };

    const newFragment = await new Fragment(fragmentData);

    // Check if the Content-Type is supported
    if (!Fragment.isSupportedType(contentType)) {
      return res.status(415).json({ error: 'Unsupported Media Type' });
    }

    // Store the file data and metadata in the database or any other storage mechanism
    await newFragment.setData(content);
    await newFragment.save();

    // Send the response with the newly created fragment metadata
    const data = createSuccessResponse({ fragment: newFragment });
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating fragment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
