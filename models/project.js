import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  smallBanner: String,
  lagerBanner: String,
  likes: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const ProjectModal = mongoose.model("ProjectModal", projectSchema);

export default ProjectModal;
