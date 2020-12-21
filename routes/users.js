const router = require('express').Router();
const { getMe } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getMe);

module.exports = router;
