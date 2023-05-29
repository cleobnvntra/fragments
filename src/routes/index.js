// src/routes/index.js

const express = require('express');
<<<<<<< HEAD
const { authenticate } = require('../authentication');
=======
>>>>>>> d2479c16df0ba478598fee66dc78e757304afdd0

// version and author from package.json
const { version, author } = require('../../package.json');

<<<<<<< HEAD
// Create a router that we can use to mount our API
const router = express.Router();

=======
// Our authentication middleware
const { authenticate } = require('../authorization/index');

// Create a router that we can use to mount our API
const router = express.Router();

// response creator from response.js
const {createSuccessResponse} = require('../response');

>>>>>>> d2479c16df0ba478598fee66dc78e757304afdd0
/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
<<<<<<< HEAD
  // Send a 200 'OK' response
  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/cleobnvntra/fragments',
    version,
  });
=======
  const data = createSuccessResponse(
    {
      author,
      githubUrl: 'https://github.com/cleobnvntra/fragments',
      version
    });
  // Send a 200 'OK' response
  res.status(200).json(data);
>>>>>>> d2479c16df0ba478598fee66dc78e757304afdd0
});

module.exports = router;
