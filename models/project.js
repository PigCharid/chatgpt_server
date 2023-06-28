import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  website: { type: String, required: true },
  name: { type: String, required: true },
  creator: { type: String, required: true },
  tags: { type: [String], required: true },
  smallBanner: { type: String, required: true },
  lagerBanner: { type: String, required: true },
  likes: { type: [String], default: [] },
  createdAt: {
    type: Date,
    required: true,
  },
});

const ProjectModal = mongoose.model("ProjectModal", projectSchema);

export default ProjectModal;
