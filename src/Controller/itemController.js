import Category from "../Models/Category.js";
import Item from "../Models/Item.js";
import mongoose from "mongoose";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("category");
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const item = await Item.findById(id).populate("category");
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const category = await Category.findOne({ title: req.body.category });
    if (!category) {
      return res.status(400).json({ error: "Invalid category title" });
    }

    req.body.category = category._id;

    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }
    const category = await Category.findOne({ title: req.body.category });
    if (!category) {
      return res
        .status(400)
        .json({ error: `Category "${req.body.category}" not found` });
    }
    req.body.category = category._id;
    const item = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
