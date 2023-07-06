import nodemailer from "nodemailer";
import UserVerfiyModal from "../models/userCodeVerify.js";
import UserModal from "../models/user.js";
import * as dotenv from "dotenv";
dotenv.config();
// 生成验证码
export const generateCode = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(510).json({ message: "请输入邮箱！"});
  }
  let code = Math.random().toFixed(6).slice(-6);
  try {
    // 查看是否注册过了
    const oldUser = await UserModal.findOne({ email });
    console.log('====================================');
    console.log(email);
    console.log('====================================');
    console.log('====================================');
    console.log(oldUser);
    console.log('====================================');
    if (oldUser) return res.status(510).json({ message: "用户已经存在！" });
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

    console.log(process.env.EMAIL)
    // 邮箱链接
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secureConnection: true, // use SSL
      auth: {
        user: process.env.EMAIL, // 自己的邮箱地址
        pass: process.env.EMAIL_CODE, // 不是密码，是授权码
      },
    });
    // 邮件封装
    const mailOptions = {
      from: "AnyGPT",
      to: email,
      subject: "验证码",
      html: `<h1>${code}</h1>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(510).json({ message: "验证码请求失败" });
        console.log("error", error);
        return;
      }
      transporter.close();
      console.log("Message sent: %s", info.messageId);
      res.status(200).json({ message: "验证码请求成功" });
    });
  } catch (error) {
    res.status(510).json({ message: "验证码请求错误" });
    console.log(error);
  }
};
