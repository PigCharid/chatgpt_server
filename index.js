import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js";
import ProjectRouter from "./routes/project.js";
import userCodeVerifyRouter from "./routes/userCodeVerify.js";
import nodemailer from "nodemailer";

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRouter);
app.use("/project", ProjectRouter);
app.use("/generatecode", userCodeVerifyRouter);

let code = Math.random().toFixed(6).slice(-6);
  console.log("code", code);
// 邮箱链接
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secureConnection: true, // use SSL
  auth: {
    user: "wp1308052418", // 自己的邮箱地址
    pass: "zxhpwfmevyjxzqij", // 不是密码，是授权码
  },
});
// 邮件封装
const mailOptions = {
  from: "wp1308052418@gmail.com",
  to: "pppp1308052418@gmail.com",
  subject: "验证码",
  html: `<h1>${code}</h1>`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    //   res.status(510).json({ message: "Generate Code Error" });
    console.log("error", error);
    return;
  }
  transporter.close();
  console.log(info);
});

const CONNECTION_URL =
  "mongodb+srv://charid:wp8530813@cluster0.tahxk7t.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 8000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
