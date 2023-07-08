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
        : await Fragment.byUser(req.user, true);
    logger.debug(fragments);

    // Create the success response with the fragments data
    const data = createSuccessResponse({ fragments: fragments });

    // Send the response with the fragments data
    const baseUrl = req.headers.host + '/v1/fragments';
    res.setHeader('Location', baseUrl);
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    return res.status(200).json(data);
  } catch (err) {
    // Handle any errors that occur during the process
    const error = createErrorResponse(500, 'Internal Server Error');
    logger.error(error);
    return res.status(500).json(error);
  }
};

module.exports.getFragmentInfo = async (req, res) => {
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
    const parts = (req.params.id).split('.');
    const id = parts[0];
    const ext = parts[1];
    const fragment = await Fragment.byId(req.user, id); 

    logger.debug(fragment);

    let text;
    try {
      text = await fragment.getData();
      logger.debug(text.toString());
    } catch (err) {
      const error = createErrorResponse(404, err.message);
      logger.error(error);
      return res.status(404).json(error);
    }

    //Check if the extension is supported for conversion
    if (ext && !fragment.formats.includes(ext)) {
      logger.error(`${ext} is an invalid conversion.`);
      return res.status(415).send(`${ext} is an invalid conversion.`);
    }

    if (ext) {
      try {
        text = await handleConversion(text, fragment.type, ext);
        logger.debug(text);
      }
      catch(err) {
        const error = createErrorResponse(415, err.message);
        logger.error(error);
        return res.status(415).json(error);
      }
    }

    const baseUrl = req.headers.host + '/v1/fragments/';
    res.setHeader('Content-Type', fragment.type);
    res.setHeader('Location', baseUrl + fragment.id);
    res.setHeader('Access-Control-Expose-Headers', 'Location');

    if(fragment.type == 'application/json') {
      return res.status(200).json(text);
    }
    return res.status(200).send(text);
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    logger.error(error);
    return res.status(404).json(error);
  }
};

const handleConversion = async (data, from, to) => {
    if (from === 'text/markdown' && to === 'html') {
      const md = require('markdown-it')();
      return md.render(data.toString());
    } else if ((from === 'text/html' || from === 'text/markdown' || from === 'application/json') && to === 'txt') {
      return data.toString();
    }
    return data;
}
