import nodemailer from "nodemailer";

export default async function sendEmail(html, email) {
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
    from: "Inactive clients report <mail@xmtextiles.com>",
    to: "admin@xmtextiles.com",
    subject: "Your inactive clients report is ready!",
    html,
  });

  console.log(info);
}
