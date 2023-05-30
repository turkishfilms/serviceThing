const nodemailer = require('nodemailer');
require('dotenv').config()

const PWD = process.env.APP_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ddrbnsn@gmail.com',
    pass: PWD
  }
});

const mailOptions = {
  from: 'ddrbnsn@gmail.com',
  to: 'ddrbnsn@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'TRASHKID'
};

transporter.sendMail(mailOptions, (error, info) => {
  console.log(error ? error : 'Email sent: ' + info.response)
});