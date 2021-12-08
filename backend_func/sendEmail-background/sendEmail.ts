import nodemailer from "nodemailer";
import XLSX from "xlsx-js-style";
import { CorporateEmail, InActiveData } from "../../src/types";
import { pluralMap } from "../../src/helpers";
import generateExcelFileStructure from "../../src/components/Export/ExcelGeneration";

export default async function sendEmail(
  { filename, content }: ReturnType<typeof generateExcelFileStructure>,
  html: any,
  email: CorporateEmail,
  type: keyof InActiveData,
  name: string
) {
  const transporter = nodemailer.createTransport({
    host: "mx.xmtextiles.com",
    port: 587,
    secure: false,
    auth: {
      user: "mail@xmtextiles.com",
      pass: "FP40#Wp2@Gv{V",
    },
  });

  console.log("going to send email");
  const info = await transporter.sendMail({
    from: "Inactive clients report <mail@xmtextiles.com>",
    to: email,
    subject: `Inactive ${pluralMap[type]} of ${name}`,
    html,
    attachments: [
      {
        filename,
        content: XLSX.write(content, {
          type: "buffer",
        }),
      },
    ],
  });
  console.log(info);
}
