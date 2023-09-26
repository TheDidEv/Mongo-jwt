const nodemailer = require('nodemailer');

class MailService {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  //to - емеіл п оякому відправляти листь
  //link -  лінк який буде відправлятися
  async sendActivationMail(to, link) {
    const newMail = {
      from: process.env.SMTP_USER,
      to,
      subject: 'Activation account on ' + process.env.API_URL,
      text: 'underText',
      html:
        `<div>` +
        `<h1>` +
        `<a href="${link}">` + link + `</a >` +
        `</h1>` +
        `</div >`,
    };
    await this.transporter.sendMail(newMail);
  }
}

module.exports = new MailService();