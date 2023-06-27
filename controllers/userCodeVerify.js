import nodemailer from "nodemailer";
import UserVerfiyModal from "../models/userCodeVerify.js";
// 生成验证码
export const generateCode = async (req, res) => {
  const { email } = req.body;
  // let code = Math.random().toFixed(6).slice(-6);
  // 先用123456
  let code = "123456";
  // 生成验证码
  try {
    // 查看之前是否有过请求记录
    const oldVerify = await UserVerfiyModal.findOne({ email });
    if (oldVerify === null) {
      await UserVerfiyModal.create({
        email,
        code,
        createdAt: new Date(),
      });
    } else {
      if (new Date() - oldVerify?.createdAt > 60000) {
        await UserVerfiyModal.findByIdAndUpdate(
          oldVerify._id,
          { code, createdAt: new Date() },
          { new: true }
        );
      } else {
        return res.status(510).json({ message: "60s请求一次" });
      }
    }
    // 这里记得删掉
    res.status(200).json({ message: "Generate code success" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
  // 邮箱链接
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secureConnection: true, // use SSL
  //   auth: {
  //     user: "wp1308052418", // 自己的邮箱地址
  //     pass: "zxhpwfmevyjxzqij", // 不是密码，是授权码
  //   },
  // });
  // // 邮件封装
  // const mailOptions = {
  //   from: "charid",
  //   to: "pppp1308052418@gmail.com",
  //   subject: "验证码",
  //   html: `<h1>${code}</h1>`,
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     res.status(510).json({ message: "Generate Code Error" });
  //     console.log("error", error);
  //     return;
  //   }
  //   transporter.close();
  //   console.log("Message sent: %s", info.messageId);
  //   res.status(200).json({ message: "Generate code success" });
  // });
};
