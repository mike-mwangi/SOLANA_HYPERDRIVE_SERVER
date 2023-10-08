import { deleteAllDocumentFiles, uploadFilesToS3, uploadOrReplaceFilesOnS3 } from "../Services/Storage.js";
import Registry from "../models/Registry.js";
import mongoose from "mongoose";

export const create = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId();
    const files = await uploadFilesToS3(req.files, id);
    const registry = new Registry({
      _id: id,
      ...req.body,
      ...files,
      owner: req.userId,
    });
    const savedRegistry = await registry.save();
    res.status(201).json({
      success: true,
      message: "Registry created successfully",
      data: savedRegistry,
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
    const registry = await Registry.findById(req.params.id);

    if (!registry) {
      return res
        .status(400)
        .json({ success: false, message: "Registry does not exist", data: {} });
    }
    let updates = req.body;
    let files = {};
    const step = updates.step;

    files = await uploadOrReplaceFilesOnS3(registry, req.files, registry._id);
    updates = { ...updates, ...files };

    const updatedRegistry = await Registry.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Registry updated successfully",
      data: updatedRegistry,
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
    const registry = await Registry.findById(req.params.id);
    if (!registry) {
      return res
        .status(400)
        .json({ success: false, message: "Registry does not exist", data: {} });
    }

    registry.registryStatus = "Pending Approval";
    registry.step = registry.step + 1;
    await registry.save();
    return res.status(200).json({
      success: true,
      message: "Registry submitted successfully",
      data: registry,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

export const getRegistry = async (req, res) => {
  try {
    const registry = await Registry.findById(req.params.id);
    if (!registry) {
      return res
        .status(400)
        .json({ success: false, message: "Registry does not exist", data: {} });
    }
    return res.status(200).json({
      success: true,
      message: "Registry fetched successfully",
      data: registry,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

export const getRegistries = async (req, res) => {
  try {
    const registries = await Registry.find({ owner: req.user._id });
    return res.status(200).json({
      success: true,
      message: "Registries fetched successfully",
      data: registries,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};
