'use strict';

// 3rd Party Resources
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const  { UsersModel } = require('./models/index.js');

const router = express.Router();

// Signup Route -- create a new user
router.post('/signup', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let encryptedPassword = await bcrypt.hash(password, 10);

  let user = await UsersModel.create({
    username,
    password: encryptedPassword,
  });

  console.log('NEWLY CREATED USER!', user);
  
  const userWithoutPassword = { ...user.toJSON() };  // convert to plain object, if it's a Sequelize instance
  delete userWithoutPassword.password;
  res.status(201).send(userWithoutPassword);
});

// Signin Route -- login with username and password
router.post('/signin', async (req, res) => {

  try {
    let basicHeaderParts = req.headers.authorization.split(' ');
    let encodedString = basicHeaderParts.pop();
    let decodedString = base64.decode(encodedString);
    let [username, password] = decodedString.split(':');
    const user = await UsersModel.findOne({ where: { username: username } });
    if (!user) {
      return res.status(403).send('Invalid Login'); // Username not found
    }
    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
      const userWithoutPassword = { ...user.toJSON() };
      delete userWithoutPassword.password;
      res.status(200).json(userWithoutPassword);
    } else {
      throw new Error('Invalid Password'); // Incorrect password
    }
  } catch (error) {
    res.status(403).send('Invalid Login');
  }
});

module.exports = router;