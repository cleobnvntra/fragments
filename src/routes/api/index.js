// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

const getHandler = require('./get');

//GET route for /v1/fragments and /v1/fragments/?expanded=1 query
router.get('/fragments', getHandler);

//GET route for /v1/fragments/:id to retrieve the data of a fragment based on the id parameter
router.get('/fragments/:id', getHandler.getFragmentById);

//GET route for /v1/fragments/:id/info to retrieve a fragment metadata based on the id parameter
router.get('/fragments/:id/info', getHandler.getFragment);

//PUT route for /v1/fragments/:id to update a fragment based on id parameter
router.put('/fragments/:id', require('./put'));

//POST route for /v1/fragments to create new fragment
router.post('/fragments', require('./post'));

//DELETE route for /v1/fragments/:id to delete a fragment based on id parameter
router.delete('/fragments/:id', require('./delete'));

module.exports = router;
