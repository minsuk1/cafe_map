var express = require('express');
var router = express.Router();
const data = require('../db.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function(req, res, next) {
  res.render('upload');
});

module.exports = router;
