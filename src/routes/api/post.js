const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { createSuccessResponse } = require('../../response');

module.exports = (req, res) => {
  const hashEmail = (email) => {
    const hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
  };

  // Extract the file data from the request body
  const content = req.body;
  const userToken = req.headers.authorization.replace('Bearer ', '');
  const decodedToken = jwt.decode(userToken);

  // Extract the Content-Type header from the request
  const contentType = req.get('Content-Type');

  // Check if the Content-Type is supported
  const supportedTypes = [
    'text/plain',
    'text/markdown',
    'text/html',
    'application/json',
    'image/png',
    'image/jpeg',
    'image/webp',
  ];

  if (!supportedTypes.includes(contentType)) {
    return res.status(415).json({ error: 'Unsupported Media Type' });
  }

  // Generate a new fragment ID using a UUID
  const fragmentId = crypto.randomUUID();

  // Generate the ownerId by hashing the username
  const ownerId = hashEmail(decodedToken.email);

  // Get the current timestamp for created and updated fields
  const timestamp = new Date().toISOString();

  // Calculate the size of the file data in bytes
  const size = Buffer.byteLength(content);

  // Create the new fragment metadata
  const newFragment = {
    id: fragmentId,
    ownerId: ownerId,
    created: timestamp,
    updated: timestamp,
    type: contentType,
    size: size,
  };

  // Store the file data and metadata in the database or any other storage mechanism

  const data = createSuccessResponse({ fragment: newFragment });
  // Send the response with the newly created fragment metadata
  res.status(201).location().json(data);
};
