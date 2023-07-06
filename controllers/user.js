import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModal from "../models/user.js";
import UserVerfiyModal from "../models/userCodeVerify.js";

const secret = "AnyGPT";

export const signin = async (req, res) => {
  const { email, password, code } = req.body;
  if (!email) {
    return res.status(510).json({ message: "请输入邮箱！" });
  }
  console.log("password", password);
  console.log("code", code);
  const oldUser = await UserModal.findOne({ email });
  if (code === undefined || code === "") {
    try {
      if (!oldUser) return res.status(510).json({ message: "用不不存在" });
      const isPasswordCorrect = await bcrypt.compare(
        password,
        oldUser.password
      );

      if (!isPasswordCorrect)
        return res.status(510).json({ message: "密码错误" });

      const token = jwt.sign(
        { email: oldUser.email, id: oldUser._id },
        secret,
        {
          expiresIn: "30d",
        }
      );

      res.status(200).json({
        user_info: {
          id: oldUser._id,
          email: oldUser.email,
          username: oldUser.username,
          logo: oldUser.logo,
          integral: oldUser.integral,
        },
        token,
      });
    } catch (err) {
      res.status(510).json({ message: "登录错误" });
    }
  } else {
    try {
      if (!oldUser) return res.status(510).json({ message: "用户不存在" });
      const codeVerify = await UserVerfiyModal.findOne({ email });
      if (codeVerify === null)
        return res.status(510).json({ message: "未请求验证码" });
      if (code !== codeVerify.code)
        return res.status(510).json({ message: "验证码错误" });
      if (new Date() - codeVerify?.createdAt > 60000)
        return res.status(510).json({ message: "验证码过期" });
      const token = jwt.sign(
        { email: oldUser.email, id: oldUser._id },
        secret,
        {
          expiresIn: "30d",
        }
      );
      await UserVerfiyModal.findByIdAndRemove(codeVerify._id);
      res.status(200).json({
        user_info: {
          id: oldUser._id,
          email: oldUser.email,
          username: oldUser.username,
          logo: oldUser.logo,
          integral: oldUser.integral,
        },
        token,
      });
    } catch (err) {
      res.status(510).json({ message: "登录错误" });
    }
  }
};

export const signup = async (req, res) => {
  const { email, code, password } = req.body;
  // 参数都要判断的
  if (!email) {
    return res.status(510).json({ message: "请输入邮箱！" });
  }
  try {
    const oldUser = await UserModal.findOne({ email });
    console.log("oldUser", oldUser);
    if (oldUser)
      return res.status(510).json({ message: "用户已经存在" });
    const codeVerify = await UserVerfiyModal.findOne({ email });
    if (codeVerify === null)
      return res.status(510).json({ message: "未请求验证码" });
    if (code !== codeVerify.code)
      return res.status(510).json({ message: "验证码错误" });
    if (new Date() - codeVerify?.createdAt > 60000)
      return res.status(510).json({ message: "验证码过期" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserModal.create({
      email,
      password: hashedPassword,
      username: email,
      logo: "",
    });
    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "30d",
    });
    await UserVerfiyModal.findByIdAndRemove(codeVerify._id);
    res.status(200).json({
      user_info: {
        id: result._id,
        email,
        username: email,
        logo: "",
        integral: 1000,
      },
      token,
    });
  } catch (error) {
    res.status(510).json({ message: "注册失败" });
    console.log(error);
  }
};

export const updataprofile = async (req, res) => {
  //   const { email, password, username, logo } = req.body;

  //   try {
  //     const oldUser = await UserModal.findOne({ email });

  //     if (oldUser)
  //       return res.status(400).json({ message: "User already exists" });

  //     const hashedPassword = await bcrypt.hash(password, 12);

  //     const result = await UserModal.create({
  //       email,
  //       password: hashedPassword,
  //       username,
  //       logo,
  //     });

  //     const token = jwt.sign({ email: result.email, id: result._id }, secret, {
  //       expiresIn: "24h",
  //     });

  res.status(201).json({ result, token });
  //   } catch (error) {
  //     res.status(500).json({ message: "Something went wrong" });
  //     console.log(error);
  //   }
};
