const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs"); // !!!
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        next(null, false, { message: "Incorrect username." });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, { message: "Incorrect password." });
        return;
      }

      next(null, foundUser);
    });
  })
);

//Google Auth

passport.use(
  new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },

  (accessToken, refreshToken, profile, done) => {
    console.log("Google account details:", profile.displayName, profile._json.email, profile.id);
     User.findOne({googleID: profile.id})
       .then(user => {
         if (user) {
           console.log("User Found: >>>>>>>")
          return done(null, user);
        
         }
         if (!user){
           console.log("User not Found: <<<<<<<<<<<<<")
         User.create({ username: profile.displayName, email: profile._json.email, googleID: profile.id, avatarURL: profile.photos[0].value })           
         .then(newUser => {
          console.log("User created: <<<<<<<<<<<<<") 
             return done(null, newUser);
           })
           .catch(err => done(err)); // closes User.create()
          }})
       .catch(err => done(err)); // closes User.findOne()
   }

) 
);