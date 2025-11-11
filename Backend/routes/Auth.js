const express = require('express');
 const router = express.Router();
   const authapi = require('../controler/auth')

 router.post('/login', authapi.login);
  router.post('/verifyOtp', authapi.verifyOtp)
  router.patch('/logout', authapi.logout)
  

  //get profile 
  

  module.exports = router;