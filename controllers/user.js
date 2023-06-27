import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";
import UserVerfiyModal from "../models/userCodeVerify.js";

const secret = "charid";

export const signin = async (req, res) => {
  const { email, password, code } = req.body;
  console.log("password", password);
  console.log("code", code);
  if (code === undefined) {
    try {
      const oldUser = await UserModal.findOne({ email });

      if (!oldUser)
        return res.status(510).json({ message: "User doesn't exist" });

      const isPasswordCorrect = await bcrypt.compare(
        password,
        oldUser.password
      );

      if (!isPasswordCorrect)
        return res.status(510).json({ message: "password error" });

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
      res.status(510).json({ message: "Something went wrong" });
    }
  } else {
    try {
      const oldUser = await UserModal.findOne({ email });

      if (!oldUser)
        return res.status(510).json({ message: "User doesn't exist" });
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
      res.status(510).json({ message: "Something went wrong" });
    }
  }
};

export const signup = async (req, res) => {
  const { email, code, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });
    console.log("oldUser", oldUser);
    if (oldUser)
      return res.status(510).json({ message: "User already exists" });
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
