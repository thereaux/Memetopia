var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var promise = mongoose.connect('mongodb://localhost:8000/www', {
    useMongoClient: true,
});
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    DOB: {type: Date, required: true},
    username: {type: String, required: true}
},  {collection: 'memeRepo'});

var MemeRepo = mongoose.model('MemeRepo', userDataSchema);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/get-data', function(req, res) {
  UserData.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.post('/insert', function(req, res) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    user: req.username
  };

  var data = new MemeRepo(item);
  data.save();

  res.redirect('/');
});

router.post('/update', function(req, res) {
  var id = req.body.id;

  MemeRepo.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.title = req.body.title;
    doc.content = req.body.content;
    doc.username = req.body.username;
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function(req, res) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
  res.close();
});

module.exports = router;
