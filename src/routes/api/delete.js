const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (!fragment) {
      const error = createErrorResponse(404, 'Unable to find fragment id: ' + req.params.id);
      return res.status(404).json(error);
    }

    await Fragment.delete(req.user, req.params.id);

    const successResponse = createSuccessResponse({ code: 200, message: 'Fragment deleted' });
    return res.status(200).json(successResponse);
  } catch (err) {
    const error = createErrorResponse(500, 'Internal Server Error');
    res.status(500).json(error);
  }
};
