const nodemailer = require('nodemailer');
const config = require("./config/key");

const transport = nodemailer.createTransport({
  service:'gmail',
    auth: {
        user: config.mailerEmail,
        pass: config.mailerPass
    }
});

module.exports = {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  }
}
