// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    // Retrieve all fragments for the current user
    let fragments =
      req.query.expand != 1
        ? await Fragment.byUser(req.user)
        : (fragments = await Fragment.byUser(req.user, true));
    logger.debug(fragments);

    // Create the success response with the fragments data
    const data = createSuccessResponse({ fragments: fragments || [] });

    // Send the response with the fragments data
    return res.status(200).json(data);
  } catch (err) {
    // Handle any errors that occur during the process
    const error = createErrorResponse(500, 'Internal Server Error');
    logger.error(error);
    return res.status(500).json(error);
  }
};

module.exports.getFragment = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug(fragment);

    const data = createSuccessResponse({ code: 200, fragments: fragment });
    const baseUrl = req.headers.host + '/v1/fragments/';
    res.setHeader('Location', baseUrl + fragment.id);
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    return res.status(200).json({ ...data });
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
    return res.status(404).json(error);
  }
};

module.exports.getFragmentById = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug(fragment);

    let text;
    try {
      text = await fragment.getData();
    } catch (err) {
      const error = createErrorResponse(404, err.message);
      logger.error(error);
      return res.status(404).json(error);
    }

    const baseUrl = req.headers.host + '/v1/fragments/';
    res.setHeader('Content-Type', fragment.type);
    res.setHeader('Location', baseUrl + fragment.id);
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    return res.status(200).send(text);
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
    return res.status(404).json(error);
  }
};
