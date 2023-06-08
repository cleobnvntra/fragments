const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    let error;

    if (!fragment) {
      error = createErrorResponse(404, 'Unable to find fragment id: ' + req.params.id);
      return res.status(404).json(error);
    }

    const reqContentType = req.get('Content-Type');

    if (reqContentType != fragment.type) {
      error = createErrorResponse(400, 'Content-Type mismatch');
      return res.status(400).json(error);
    }

    // Get the updated data from the request body
    const updatedData = req.body;

    // Update the fragment's data
    await fragment.setData(updatedData);
    fragment.updated = new Date().toISOString();
    fragment.size = Buffer.byteLength(updatedData);
    await fragment.save();

    const data = createSuccessResponse({
      message: 'Fragment data updated successfully',
      fragment: fragment,
    });
    return res.status(200).json(data);
  } catch (err) {
    const error = createErrorResponse(500, 'Error updating fragment data');
    return res.status(500).json(error);
  }
};
