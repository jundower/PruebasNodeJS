const express = require('express');
const router = express.Router();
const {poolPromise, mssql} = require ('../../../database');
const {isLoggedin} = require('../../../lib/auth');

module.exports = router;