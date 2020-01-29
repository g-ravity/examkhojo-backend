const config = require("config");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: FacebookStrategy } = require("passport-facebook");

const { User } = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get("googleClientID"),
      clientSecret: config.get("googleSecret"),
      callbackURL: "/api/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (!user || !user.googleId) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value
          });
        } else {
          user.set({
            googleId: profile.id,
            profilePicture: profile.photos[0].value
          });
        }
        try {
          user = await user.save();
          done(null, user);
        } catch (err) {
          console.log(err);
          done(err, user);
        }
      }
      done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.get("facebookClientID"),
      clientSecret: config.get("facebookSecret"),
      callbackURL: "/api/auth/facebook/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ facebookId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (!user || !user.facebookId) {
          user = new User({
            facebookId: profile.id,
            name: profile.name.givenName.concat(" ", profile.name.familyName),
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value
          });
        } else {
          user.set({
            facebookId: profile.id,
            profilePicture: profile.photos[0].value
          });
        }
        try {
          user = await user.save();
          done(null, user);
        } catch (err) {
          console.log(err);
          done(err, user);
        }
      }
      done(null, user);
    }
  )
);

module.exports = passport;
