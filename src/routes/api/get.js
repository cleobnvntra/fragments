<<<<<<< HEAD
// src/routes/api/get.js
=======
// src/routes/api/get.js\
const {createSuccessResponse} = require('../../response');
>>>>>>> d2479c16df0ba478598fee66dc78e757304afdd0

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
<<<<<<< HEAD
  // TODO: this is just a placeholder to get something working...
  res.status(200).json({
    status: 'ok',
    fragments: [],
  });
=======
  const data = createSuccessResponse({fragments: []});
  res.status(200).json(data);
>>>>>>> d2479c16df0ba478598fee66dc78e757304afdd0
};
