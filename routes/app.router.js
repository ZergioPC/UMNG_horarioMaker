const express = require("express");
const router = express.Router();
const loginAuth = require("../auth/login.auth.js");

router.post('/auth', loginAuth.login);

module.exports = router;