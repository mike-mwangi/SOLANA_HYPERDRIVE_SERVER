import {
  deleteAllDocumentFiles,
  uploadFilesToS3,
  uploadOrReplaceFilesOnS3,
} from "../Services/Storage.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";
import { inviteProjectDeveloper } from "../utils/inviteUser.js";

export const create = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId();
    const files = await uploadFilesToS3(req.files, id);
    const project = new Project({
      _id: id,
      ...req.body,
      ...files,
      registry: req.userId,
    });
    const savedProject = await project.save();
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: savedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
};

export const update = async (req, res) => {
  try {
    // check the base case
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "Project does not exist", data: {} });
    }
    let updates = req.body;
    let files = {};
    const step = updates.step;

    if (step == 4) {
      updates.developer = await inviteProjectDeveloper(updates);
    }

    files = await uploadOrReplaceFilesOnS3(project, req.files, project._id);
    updates = { ...updates, ...files };

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message, data: {} });
  }
};

export const submit = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "Project does not exist", data: {} });
    }

    project.status = "Pending Approval";
    project.stage = "submitted";
    project.step = project.step + 1;
    await project.save();
    return res.status(200).json({
      success: true,
      message: "Project submitted successfully",
      data: project,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate({
      path: "registry",
      populate: {
        path: "profile",
      },
    });
    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "Project does not exist", data: {} });
    }
    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ registry: req.userId })
      .populate({
        path: "registry",
        populate: {
          path: "profile",
        },
      })
      .lean();
    return res.status(200).json({
      success: true,
      message: "Registries fetched successfully",
      data: projects,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

export const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ stage: "submitted" })
      .populate({
        path: "registry",
        populate: {
          path: "profile",
        },
      })
      .lean();
    return res.status(200).json({
      success: true,
      message: "Registries fetched successfully",
      data: projects,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};
