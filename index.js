const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const rateLimitMiddleware = require('./rateLimitMiddleware');
const { userByUserId, userByUsername } = require('./users');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = userByUsername(username);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  },
));

passport.serializeUser((user, done) => done(null, user.userId));

passport.deserializeUser((userId, done) => {
  const user = userByUserId(userId);
  return done(null, user);
});

function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  return next();
}

app.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.json(req.user);
  });

app.get('/protected',
  passport.authenticate('session'),
  ensureAuthenticated,
  rateLimitMiddleware,
  (req, res) => {
    res.json({
      protected: 'resource',
    });
  });

module.exports = app;
