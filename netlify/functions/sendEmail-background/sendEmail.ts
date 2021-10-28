import nodemailer from "nodemailer";

async function sendEmail(email: string) {
  const transporter = nodemailer.createTransport({
    host: "mx.xmtextiles.com",
    port: 587,
    secure: false,
    auth: {
      user: "mail@xmtextiles.com",
      pass: "FP40#Wp2@Gv{V",
    },
  });

  const info = await transporter.sendMail({
    from: process.env.MAILGUN_SENDER,
    to: "admin@xmtextiles.com",
    subject: "Your inactive clients report is ready!",
    text: "See attached report PDF",
  });

  console.log(info);
}

export default sendEmail;
