import nodemailer from "nodemailer";
import userVerfiyModal from "../models/userCodeVerify.js";
// 生成验证码
export const generateCode = async (req, res) => {
  // 邮箱
  const { email } = req.body;
  // 生成验证码
  try {
    // 查看之前是否有过请求记录
    const oldVerify = await userVerfiyModal.findOne({ email });
    console.log("oldVerify", oldVerify);
    if (!oldVerify) {
      // 如果有的话
      // 判断时间是否过期了 过期了就重新生成 没有过期就不生成
      //   const updatedCode = { creator, title, message, tags, selectedFile, _id: id };
      //   await ProjectModal.findByIdAndUpdate(id, updatedPost, { new: true });
    } else {
      const result = await userVerfiyModal.create({
        email,
        code,
        createdAt: new Date(),
      });
      console.log(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
  // 邮箱链接
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secureConnection: true, // use SSL
    auth: {
      user: "wp1308052418", // 自己的邮箱地址
      pass: "zbrwlcwxvcgfqeai", // 不是密码，是授权码
    },
  });
  // 邮件封装
  const mailOptions = {
    from: "Charid",
    to: "pppp1308052418@gmail.com",
    subject: "验证码",
    html: `<h1>${code}</h1>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(510).json({ message: "Generate Code Error" });
      console.log("error", error);
      return;
    }
    transporter.close();
    console.log("Message sent: %s", info.messageId);
    
  });
  res.status(200).json({ message: "Generate code success" });
};
