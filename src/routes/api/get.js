// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const sharp = require('sharp');

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
    const baseUrl = 'http://' + req.headers.host + '/v1/fragments';
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
    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    res.setHeader('Content-Type', fragment.mimeType);
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
    const parts = req.params.id.split('.');
    const id = parts[0];
    const ext = parts[1];

    let fragment;
    try {
      fragment = await Fragment.byId(req.user, id);
      // logger.debug(fragment);
    } catch (err) {
      const error = createErrorResponse(404, err.message);
      logger.error(error);
      return res.status(404).json(error);
    }

    let data;
    try {
      data = await fragment.getData();
      // logger.debug(data);
    } catch (err) {
      const error = createErrorResponse(404, err.message);
      logger.error(error);
      return res.status(404).json(error);
    }

    if (ext) {
      //Check if the extension is supported for conversion
      //If extension is supported for conversion, handle it
      if (fragment.formats.includes(ext)) {
        data = await handleConversion(fragment, data, ext);
        logger.debug(data);
      } else {
        logger.error(`${ext} is an invalid conversion.`);
        return res.status(415).send(`${ext} is an invalid conversion.`);
      }
    } else {
      if (fragment.type.startsWith('image/')) {
        const format = fragment.type.split('/')[1];
        // logger.debug(format);
        try {
          if (format === 'gif') {
            data = await sharp(data, { animated: true }).gif().toBuffer();
          } else {
            data = await sharp(data).toFormat(format).toBuffer();
          }
        } catch (err) {
          const error = createErrorResponse(500, err);
          logger.error(error);
          return res.status(500).json(error);
        }
      }
    }

    const baseUrl = 'http://' + req.headers.host + '/v1/fragments/';
    res.setHeader('Content-Type', fragment.mimeType);
    res.setHeader('Location', baseUrl + fragment.id);
    res.setHeader('Access-Control-Expose-Headers', 'Location');

    if (fragment.type == 'application/json') {
      return res.status(200).json(JSON.parse(data));
    }

    return res.status(200).send(data);
  } catch (err) {
    const error = createErrorResponse(500, err.message);
    logger.error(error);
    return res.status(500).json(error);
  }
};

const handleConversion = async (fragment, data, to) => {
  if (fragment.type.startsWith('image/')) {
    if (to === 'gif') {
      let img = sharp(data, { animated: true });
      data = img.gif().toBuffer();
    } else {
      let img = sharp(data);
      data = await img.toFormat(to).toBuffer();
    }
    fragment.type = `image/${to}`;
    await fragment.save();
    return data;
  } else {
    if (fragment.isText) {
      if (fragment.type === 'text/markdown') {
        if (to === 'html') {
          const mdToHtml = require('markdown-it')();
          data = mdToHtml.render(data.toString());
          fragment.type = 'text/html';
          await fragment.setData(data);
          return data;
        }

        if (to === 'txt') {
          fragment.type = 'text/plain';
          await fragment.save();
          return data.toString();
        }
      } else if (fragment.type === 'text/html' && to === 'txt') {
        fragment.type = 'text/plain';
        await fragment.save();
        return data.toString();
      }
    } else if (fragment.type === 'application/json' && to === 'txt') {
      data = data.toString();
      fragment.type = 'text/plain';
      await fragment.setData(data);
      return data;
    }
  }
  return data;
};
