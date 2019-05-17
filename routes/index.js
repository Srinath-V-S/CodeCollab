var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('../config');

var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CodeCollab - A Platform for sharing code' });
});

router.get('/about',function(req,res,next){
  res.render('about',{title : 'CodeCollab - A Platform for sharing code'});
});

router.route('/contact')
  .get(function(req,res,next){
    res.render('contact',{title : 'CodeCollab - A Platform for sharing code' })
})
  .post(function(req,res,next){

    req.checkBody('name','Empty name').notEmpty();
    req.checkBody('email','Invalid Email').isEmail();
    req.checkBody('message','Empty message').notEmpty();
    var errors = req.validationErrors();

    if(errors){
      res.render('contact',{
        title :'CodeCollab - A Platform for sharing code',
        name:req.body.name,
        email:req.body.email,
        message:req.body.message,
        errorMessages:errors
      });
    }
    else{
      var mailOptions = {
        form : 'CodeCollab <noreply@codecollab.com>',
        to : 'demojanedoe100@gmail.com',
        subject : "You got a new message from visitor 😎 😎 😎 ",
        text : req.body.message
      };
transporter.sendMail(mailOptions,function(error,info){
  if(error){
    console.log(error);
  }
  else{
        res.render('thanks',{ title : 'CodeCollab - A Platform for sharing code'})
  }
});
}
});



module.exports = router;
