const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/userController');

/**
 * @route POST /api/user
 * @desc Creates a new user or loads an existing user by phone number
 * @body {string} phone - Phone number used as unique user identifier
 * @returns {Object} JSON with the user ID
 */
router.post('/', createUser);

// Export the router for use in the main app
module.exports = router;
