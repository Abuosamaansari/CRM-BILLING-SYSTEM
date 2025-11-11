require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../config/database"); 
 const {sendinformation, sendotp} = require('../mailservies/mailservices')

 
 exports.login = (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }
  
      const sql = "SELECT * FROM crm_tbl WHERE username = ?";
  
      database.query(sql, [username], async (err, results) => {
        if (err) {
          console.error("❌ DB Error:", err);
          return res.status(500).json({ message: "Database error" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }
  
        const user = results[0];
  
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
  
         
        const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();
         console.log("otp", generateOtp);
        const expiry = new Date(Date.now() + 5 * 60 * 1000);  
  
        
        const updateOtpSql = "UPDATE crm_tbl SET otp = ?, otpExpires = ? WHERE id = ?";
        database.query(updateOtpSql, [generateOtp, expiry, user.id], async (err) => {
          if (err) {
            return res.status(500).json({ message: "Failed to save OTP" });
          }
  
         
          try {
            await sendotp({ ...user, generateOtp });
            console.log("> OTP sent to:", user.email);
            return res.status(200).json({
              message: "OTP sent successfully",
              username: user.username,
              email: user.email,
            });
          } catch (emailErr) {
            console.error(" Email sending failed:", emailErr);
            return res.status(500).json({ message: "Failed to send OTP email" });
          }
        });
      });
    } catch (error) {
      console.error(" Server Error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  exports.verifyOtp = (req, res) => {
    try {
      const { username, otp } = req.body;
  
      if (!username || !otp) {
        return res.status(400).json({ message: "Username and OTP are required" });
      }
   
      const sql = "SELECT * FROM crm_tbl WHERE username = ? AND otp = ?";
      database.query(sql, [username, otp], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(401).json({ message: "Invalid OTP" });
  
        const user = results[0];
  
       
        if (new Date() > new Date(user.otpExpires)) {
          return res.status(401).json({ message: "OTP expired" });
        }
  
         
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
  
         
        const clearOtpSql = "UPDATE crm_tbl SET otp = NULL, otpExpires = NULL WHERE id = ?";
        database.query(clearOtpSql, [user.id], (err) => {
          if (err) console.error("Failed to clear OTP:", err);
        });

        try {
             sendinformation(user);
            console.log("> Login notification sent to:", user.email);
          } catch (emailErr) {
            console.error("❌ Email sending failed:", emailErr);
          }
  
        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      });
    } catch (error) {
      console.error("❌ Server Error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  };
   exports.logout = async( req,res)=>{
     req.session.destroy((err)=>{

       if(err){
         return res.status(404).json({message:"Failed to destroy session"})
       }
        else{
           return res.status(200).json({ message: 'Logged out successfully' })
        }
     })
   }