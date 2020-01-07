const express = require('express');
const {register, login, getMeCurrentUser} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMeCurrentUser);

module.exports = router;

