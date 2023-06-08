const crypto = require('crypto');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    // Extract the file data from the request body
    const content = req.body;

    // Extract the Content-Type header from the request
    const contentType = req.get('Content-Type');

    // Generate a new fragment ID using a UUID
    const fragmentId = crypto.randomUUID();

    // Calculate the size of the file data in bytes
    const size = Buffer.byteLength(content);

    // Create a new instance of the Fragment class
    const fragmentData = {
      id: fragmentId,
      ownerId: req.user,
      type: contentType,
      size: size,
    };

    const newFragment = new Fragment(fragmentData);

    // Check if the Content-Type is supported
    if (!Fragment.isSupportedType(contentType)) {
      return res.status(415).json({ error: 'Unsupported Media Type' });
    }

    // Store the file data and metadata in the database or any other storage mechanism
    await newFragment.setData(content);

    // Send the response with the newly created fragment metadata
    const data = createSuccessResponse({ fragment: newFragment, message: 'Fragment created' });
    res.setHeader('Location', newFragment.id);
    return res.status(201).json({ ...data });
  } catch (err) {
    const error = createErrorResponse(500, 'Internal Server Error');
    return res.status(500).json(error);
  }
};
