// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    // Retrieve all fragments for the current user
    const fragments = await Fragment.byUser(req.user);
    let fragmentIds = [];
    let data = {};

    // Create the success response with the fragments data
    if (req.query.expand != 1) {
      // Extract only the fragment IDs from the fragments array
      fragmentIds = fragments.map((fragment) => fragment.id);
      data = createSuccessResponse({ fragments: fragmentIds || [] });
    } else {
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

    if (!fragment) {
      const error = createErrorResponse(404, 'Unable to find fragment id: ' + req.params.id);
      return res.status(404).json(error);
    }

    const data = createSuccessResponse({ code: 200, fragments: fragment });
    return res.status(200).json(data);
  } catch (err) {
    const error = createErrorResponse(500, 'Internal Server Error');
    return res.status(500).json(error);
  }
};

module.exports.getFragmentById = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (!fragment) {
      const error = createErrorResponse(404, 'Unable to find fragment id: ' + req.params.id);
      return res.status(404).json(error);
    }

    const fragmentBuffer = await fragment.getData();
    const fragmentData = fragmentBuffer.toString();

    const data = createSuccessResponse({
      type: fragment.type,
      size: fragment.size,
      data: fragmentData,
    });
    return res.status(200).json(data);
  } catch (err) {
    const error = createErrorResponse(500, 'Internal Server Error');
    return res.status(500).json(error);
  }
};
