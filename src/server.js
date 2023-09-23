'use strict';

// 3rd Party Resources
const express = require('express');

// Import the router
const authRouter = require('./auth/router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the router to the main application
app.use(authRouter);

module.exports = {
  app,
  start: (port) => {
    app.listen(port, () => {
      console.log('Basic Auth server is running!');
    });
  },
};
