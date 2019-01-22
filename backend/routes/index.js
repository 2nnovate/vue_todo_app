const express = require('express');
const path = require('path');
const v1 = require('./v1');

const router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'index.html'));
// });

router.use('/v1', v1);

module.exports = router;
