const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const tokens = {};

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");

router.post("/signup", (req, res) => {
  // Verify that first name is not empty
  User.find({$or:[{ email: req.body.email }, {username: req.body.username}]}, (err, user) => {
    if (user && user.length) {
      res.statusCode = 500;
      res.send({
        name: "email_or_username",
        message: "The email or username already exists",
      });
      return;
    }
    if (!req.body.username) {
      res.statusCode = 500;
      res.send({
        name: "userNameError",
        message: "The username is required",
      });
      return
    }
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName || "";
          user.email = req.body.email || "";
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          user.refreshToken.push({ refreshToken });
          user.save((err) => {
            if (err) {
              res.statusCode = 500;
              res.send(err);
            } else {
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
              res.send({ success: true, token });
            }
          });
        }
      }
    );
  })
  
});
router.post("/login", passport.authenticate("local"), (req, res, next) => {

  const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  User.findById(req.user._id).then(
    (user) => {
      user.refreshToken.push({ refreshToken });
      user.save((err) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          tokens["" + token] = refreshToken;
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
          res.send({ success: true, token });
        }
      });
    },
    (err) => next(err)
  );
});

router.post("/refreshToken", (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userId = payload._id;
      User.findOne({ _id: userId }).then(
        (user) => {
          if (user) {
            // Find the refresh token against the user record in database
            const tokenIndex = user.refreshToken.findIndex(
              (item) => item.refreshToken === refreshToken
            );

            if (tokenIndex === -1) {
              res.statusCode = 401;
              res.send("Unauthorized");
            } else {
              const token = getToken({ _id: userId });
              // If the refresh token exists, then create new one and replace it.
              const newRefreshToken = getRefreshToken({ _id: userId });
              user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
              user.save((err) => {
                if (err) {
                  res.statusCode = 500;
                  res.send(err);
                } else {
                  res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
                  res.send({ success: true, token });
                }
              });
            }
          } else {
            res.statusCode = 401;
            res.send("Unauthorized");
          }
        },
        (err) => next(err)
      );
    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
});

router.get("/myself", verifyUser, (req, res) => {
  const locToken = req.headers.authorization;
  const refToken = tokens[locToken.replace('Bearer ','')];
  if (refToken) {
  res.cookie("refreshToken", refToken, COOKIE_OPTIONS);
  }

console.log(req);

  res.send(req.user);
});

router.post("/logout", verifyUser, (req, res, next) => {

  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  User.findById(req.user._id).then(
    (user) => {
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken
      );

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save((err) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          res.clearCookie("refreshToken");
          res.send({ success: true });
        }
      });
    },
    (err) => next(err)
  );
});
router.get("/users",verifyUser, (req, res, next) => {
  User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);  
  },
  (err) => next(err));
})
router.delete("/users",verifyUser, (req, res, next) => {
  if (`${req.user._id}` === req.body._id) {
    res.status(400).send({ message: 'You can not delete yourself' })
    return
  }
  return User.deleteOne({_id: req.body._id}, function(error){
    if(error){
      next(error)
    } else {
      res.send({ success: true });
    }
  })

})
module.exports = router;
