const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    // Extract the file data from the request body
    let content;
    if (Buffer.isBuffer(req.body)) {
      content = req.body;
      // logger.debug(content);
    } else {
      const error = createErrorResponse(415, 'Invalid type');
      return res.status(415).json(error);
    }

    // Extract the Content-Type header from the request
    const contentType = req.get('Content-Type');

    const size = Buffer.byteLength(content);

    // Create a new instance of the Fragment class
    const fragmentData = {
      ownerId: req.user,
      type: contentType,
      size: size,
    };

    let newFragment;
    newFragment = new Fragment(fragmentData);
    // logger.debug(newFragment);

    // Store the file data and metadata in the database or any other storage mechanism
    await newFragment.setData(content);

    // Send the response with the newly created fragment metadata
    const data = createSuccessResponse({ fragment: newFragment, message: 'Fragment created' });
    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    res.setHeader('Content-Type', newFragment.mimeType);
    res.setHeader('Location', baseUrl + newFragment.id);
    res.setHeader('Access-Control-Expose-Headers', 'Location');

    return res.status(201).json({ ...data });
  } catch (err) {
    console.log(err.message);
    const error = createErrorResponse(500, err.message);
    logger.error(error);
    return res.status(500).json(error);
  }
};
