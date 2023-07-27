import nodemailer from "nodemailer"
import { log } from "./log"

export async function mailer(title: string, body: string) {
  const transporter = nodemailer.createTransport({
    service: "163",
    auth: {
      user: process.env.NEXT_PUBLIC_SENDER,
      pass: process.env.NEXT_PUBLIC_SENDER_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Trading-Bot" <${process.env.NEXT_PUBLIC_SENDER}>`, // sender address
    to: process.env.NEXT_PUBLIC_RECEIVER, // list of receivers
    subject: title, // Subject line
    text: body,
  })
  log("email", title)
}
