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

router.get('/location',(req,res,next)=>{
  res.json({data:data})
})

router.post('/location',(req,res,next)=>{
  const {title,address,lat,lng} = req.body;
  location = {}
  location.title = title;
  location.address=address;
  location.lat=lat;
  location.lng=lng;
  res.json({
    message : "success".
    data:location
  })
})

module.exports = router;
