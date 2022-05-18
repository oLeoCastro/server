import express from "express";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

export const routes = express.Router();

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "aa6ebb625268e0",
    pass: "c879b2c0edbaeb",
  },
});

routes.post("/feedbacks", async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    },
  });
  await transport.sendMail({
    from: "Equipe Feedget <oi@feedget.com>",
    to: "Leonardo Castro <leocastro98@outlook.com>",
    subject: "Novo FeedBack",
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
      `<p>Tipo do Feedback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`,
    ].join("\n"),
  });

  return res.status(201).json({ data: feedback });
});
