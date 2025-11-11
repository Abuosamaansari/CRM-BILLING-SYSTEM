const express = require("express");
 const router = express.Router();
  const {verifyToken} = require('../Middleware/auth')

 const getprofileapi = require('../controler/profile');
 
 router.get('/getprofile', getprofileapi.getprofile);
  router.post('/createProfile/:user_id', verifyToken, getprofileapi.createProfile);

  module.exports = router;
