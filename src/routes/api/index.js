// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

const getHandler = require('./get');

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

//GET route for /v1/fragments and /v1/fragments/?expand=1 query
router.get('/fragments', getHandler);

//GET route for /v1/fragments/:id to retrieve the data of a fragment based on the id parameter
router.get('/fragments/:id', getHandler.getFragmentById);

//GET route for /v1/fragments/:id/info to retrieve a fragment metadata based on the id parameter
router.get('/fragments/:id/info', getHandler.getFragmentInfo);

//PUT route for /v1/fragments/:id to update a fragment based on id parameter
router.put('/fragments/:id', rawBody(), require('./put'));

//POST route for /v1/fragments to create new fragment
router.post('/fragments', rawBody(), require('./post'));

//DELETE route for /v1/fragments/:id to delete a fragment based on id parameter
router.delete('/fragments/:id', require('./delete'));

module.exports = router;
