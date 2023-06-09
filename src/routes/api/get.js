// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    // Retrieve all fragments for the current user
    let fragments = await Fragment.byUser(req.user);
    let data = {};

    // Create the success response with the fragments data
    if (req.query.expand != 1) {
      // Extract only the fragment IDs from the fragments array
      // fragmentIds = fragments.map((fragment) => fragment.id);
      data = createSuccessResponse({ fragments: fragments || [] });
    } else {
      fragments = await Fragment.byUser(req.user, true);
      data = createSuccessResponse({ fragments: fragments || [] });
    }

    // Send the response with the fragments data
    return res.status(200).json(data);
  } catch (err) {
    // Handle any errors that occur during the process
    const error = createErrorResponse(500, 'Internal Server Error');
    return res.status(500).json(error);
  }
};

module.exports.getFragment = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    const data = createSuccessResponse({ code: 200, fragments: fragment });
    return res.status(200).json({ ...data });
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    return res.status(404).json(error);
  }
};

module.exports.getFragmentById = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    let text;
    try {
      text = await fragment.getData();
    } catch (err) {
      const error = createErrorResponse(404, err);
      return res.status(404).json(error);
    }

    res.setHeader('Content-Type', fragment.type);
    return res.status(200).send(text);
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    return res.status(404).json(error);
  }
};
