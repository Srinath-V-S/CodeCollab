var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// initialize a new session
passport.serializeUser(function(user,done){
  done(null,user._id);
});

passport.deserializeUser(function(id,done){
  User.findOne({_id : id}, function(err,user){
    done(err,user);
  })
});


passport.use(new LocalStrategy({
  usernameField : 'email'},
  function(username,password,done){
    User.findOne({email : username},function (err,user){
      if(err) return done(err);

      if(!user){
        return done(null,false,{
          message: 'Incorrect username or password'
        });
      }
      if(!user.validPassword(password)){
        return done(null,false,{
          message : 'Incorrect username or password'
        });
      }
      return done(null,user);
    });
  }));


passport.use(new FacebookStrategy({
    clientID : '2325565704167039',
    clientSecret : 'ac492fd3a73ab775714388d2c1dbe755',
    callbackURL : 'http://localhost:3000/auth/facebook/callback',
    profileFields : ['id','displayName','email']

},function(token,refreshToken,profile,done){
  User.findOne({'facebookID' : profile.id},function(err,user){
    if(err) return done(err);
    if(user){
      return done(null,user);
    }else{
      User.findOne({email:profile.emails[0].value},function(err,user){
        if(user){
          user.facebookID = profile.id;
          return user.save(function(err){
            if(err) return done(null,false, { message : " Can't save user info"});
          })
        }

        var user = new User();
        user.name = profile.displayName;
        user.email = profile.emails[0].value;
        user.facebookID = profile.id;
        user.save(function(err){
          if(err) return done(null,false, { message : " Can't save user info"});
          return done(null,user);
        });
      })
    }

  });
}
));
