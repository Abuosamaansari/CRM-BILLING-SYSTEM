require('dotenv').config();
const nodemailer = require("nodemailer");
  
  const transportmail = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS_TOKEN,
    },
    logger: true, // debug
    debug: true,
  })

  const sendOpt = nodemailer.createTransport({
  
    service:'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS_TOKEN,
    
  }
})

async function sendinformation(user) {
    const mailOptions = {
      from: process.env.SMTP_APP_NAME,
      to: user.email,
      subject: "Login sucessfully",
      html: `<p>Hello ${user.username},<br>
          Your login was successful on ${new Date().toLocaleString()}</p>`,
    };
    const info = await transportmail.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);
  }
  async function sendotp(user) {
     const mailOptions = {
         from: process.env.SMTP_APP_NAME,
         to: user.email,
         subject: "Send sucessfully",
         html: `<p>Hello <b>${user.username}</b>,<br>
         Your OTP is: <b>${user.generateOtp}</b>
         <br>
         It is valid for 5 minutes.<br>
         Time: ${new Date().toLocaleString()}</p>`
     }
    const info = await transportmail.sendMail(mailOptions);
    console.log("📧 sent otp on email:", info.messageId);
  }
   module.exports = { sendinformation,sendOpt, sendotp}
