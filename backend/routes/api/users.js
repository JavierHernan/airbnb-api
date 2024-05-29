const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

  const requiredValidation = [
    check('firstName')
      .notEmpty({checkFalsy: false})
      .withMessage("First Name is required"),
    check('lastName')
      .notEmpty({checkFalsy: false})
      .withMessage("Last Name is required"),
    check('email')
      .notEmpty({checkFalsy: false})
      .withMessage("Email is required"),
    check('username')
      .notEmpty({checkFalsy: false})
      .withMessage("User is required"),
  ]

  const validateSignup = [
    // check('email')
    //   // .notEmpty({checkFalsy: true})
    //   .exists({ checkFalsy: true })
    //   .isEmail()
    //   .withMessage('User with that email already exists'),
    // check('username')
    //   .exists({ checkFalsy: true })
    //   .isLength({ min: 4 })
    //   .notEmpty({checkFalsy: true})
    //   .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    // check('username')
    //   // .notEmpty({checkFalsy: true})
    //   .exists({checkFalsy: true})
    //   .withMessage("User with that username already exists"),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

  // Sign up
router.post(
    '/',
    requiredValidation,
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;

      const usernameExists = await User.findOne({where: {username}})
      const emailExists = await User.findOne({where: {email}})

      if(usernameExists) {
        return res.status(500).json({
          message: "User already exists", 
          errors: {
            "username":"User with that username already exists"
          }})
      }
      if(emailExists) {
        return res.status(500).json({
          message: "User already exists", 
          errors: {
            "email":"User with that email already exists"
          }
        })
      }
      //sends error message if username is < 4 characters
      if(username.length < 4) {
        return res.status(500).json({
          message: "Please provide a username with at least 4 characters."
        })
      }

      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, firstName, lastName, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

  module.exports = router;