const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug(fragment);
    let error;

    const reqContentType = req.get('Content-Type');

    if (reqContentType != fragment.type) {
      error = createErrorResponse(400, 'Content-Type mismatch');
      logger.error(error);
      return res.status(400).json(error.message);
    }

    // Get the updated data from the request body
    let updatedData;
    if (Buffer.isBuffer(req.body)) {
      updatedData = req.body;
    } else {
      const error = createErrorResponse(415, 'Invalid type');
      return res.status(415).json(error);
    }

    // Update the fragment's data
    try {
      await fragment.setData(updatedData);
    } catch (err) {
      error = createErrorResponse(400, err.message);
      logger.error(error);
      return res.status(400).json(error);
    }

    const data = createSuccessResponse({
      message: 'Fragment data updated successfully',
      fragment: fragment,
    });

    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    res.setHeader('Content-Type', fragment.mimeType);
    res.setHeader('Location', baseUrl + fragment.id);
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    return res.status(200).json(data);
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
    return res.status(404).json(error);
  }
};
