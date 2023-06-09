const crypto = require('crypto');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

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
    logger.debug(newFragment);

    // Store the file data and metadata in the database or any other storage mechanism
    await newFragment.setData(content);

    // Send the response with the newly created fragment metadata
    const data = createSuccessResponse({ fragment: newFragment, message: 'Fragment created' });
    const baseUrl = req.headers.host + '/v1/fragments/';
    res.setHeader('Location', baseUrl + newFragment.id);
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    return res.status(201).json({ ...data });
  } catch (err) {
    const error = createErrorResponse(415, err.message);
    logger.error(error);
    return res.status(415).json(error);
  }
};
