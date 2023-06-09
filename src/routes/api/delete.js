const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    await Fragment.delete(req.user, req.params.id);

    const successResponse = createSuccessResponse({ code: 200, message: 'Fragment deleted' });
    return res.status(200).json(successResponse);
  } catch (err) {
    const error = createErrorResponse(404, err);
    logger.error(error);
    return res.status(404).json(error);
  }
};
