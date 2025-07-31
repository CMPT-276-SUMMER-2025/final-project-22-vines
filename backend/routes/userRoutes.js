const express = require('express');
const router = express.Router();
const { createOrLoadUser } = require('../controllers/userController');

router.post('/', createOrLoadUser);

module.exports = router;
