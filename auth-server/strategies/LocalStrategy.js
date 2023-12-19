const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//Called during login/sign up.
passport.use(new LocalStrategy(User.authenticate()));

//called while after logging in / signing up to set user details in req.user

passport.serializeUser((user, done) => {
    done(null, {_id: user._id});
})

passport.deserializeUser((id, done) => {
    User.findOne(
        {_id: id},
        (err, user) => {
            done(null, user);
        }
    )
})