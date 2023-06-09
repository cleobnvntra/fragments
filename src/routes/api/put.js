const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    let error;

    const reqContentType = req.get('Content-Type');

    if (reqContentType != fragment.type) {
      error = createErrorResponse(400, 'Content-Type mismatch');
      return res.status(400).json(error.message);
    }

    // Get the updated data from the request body
    const updatedData = req.body;

    // Update the fragment's data
    try {
      await fragment.setData(updatedData);
    } catch (err) {
      error = createErrorResponse(400, err.message);
      return res.status(400).json(error);
    }

    const data = createSuccessResponse({
      message: 'Fragment data updated successfully',
      fragment: fragment,
    });

    const baseUrl = req.headers.host + '/v1/fragments/';
    res.setHeader('Location', baseUrl + fragment.id);
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    return res.status(200).json(data);
  } catch (err) {
    const error = createErrorResponse(404, err.message);
    return res.status(404).json(error);
  }
};
