const router = require('express').Router();
const userRoutes = require('./users.js');
const articlesRoutes = require('./articles');

router.use(userRoutes);
router.use(articlesRoutes);

module.exports = router;
