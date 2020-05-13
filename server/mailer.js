const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service:'gmail',
    auth: {
        user: 'mlokesh.mamta@gmail.com',
        pass: 'Lokesh@8130'
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
