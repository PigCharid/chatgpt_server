import express from "express";
import mongoose from "mongoose";

import ProjectModal from "../models/project.js";

const router = express.Router();

export const getProjects = async (req, res) => {
  try {
    const projects = await ProjectModal.find();
    res.status(200).json({
      project_info: { projects },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// export const getPost = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const post = await ProjectModal.findById(id);

//     res.status(200).json(post);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const createProject = async (req, res) => {
  const post = req.body;

  // console.log(post);
  const newProjectModal = new ProjectModal({
    ...post,
  });

  try {
    await newProjectModal.save();

    res.status(200).json({ message: "创建成功" });
  } catch (error) {
    res.status(510).json({ message: error.message });
  }
};

// export const updatePost = async (req, res) => {
//   const { id } = req.params;
//   const { title, message, creator, selectedFile, tags } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No post with id: ${id}`);

//   const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

//   await ProjectModal.findByIdAndUpdate(id, updatedPost, { new: true });

//   res.json(updatedPost);
// };

// export const deletePost = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No post with id: ${id}`);

//   await PostMessage.findByIdAndRemove(id);

//   res.json({ message: "Post deleted successfully." });
// };

// export const likePost = async (req, res) => {
//   const { id } = req.params;

//   if (!req.userId) {
//     return res.json({ message: "Unauthenticated" });
//   }

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No post with id: ${id}`);

//   const post = await PostMessage.findById(id);

//   const index = post.likes.findIndex((id) => id === String(req.userId));

//   if (index === -1) {
//     post.likes.push(req.userId);
//   } else {
//     post.likes = post.likes.filter((id) => id !== String(req.userId));
//   }
//   const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
//     new: true,
//   });
//   res.status(200).json(updatedPost);
// };

export default router;
