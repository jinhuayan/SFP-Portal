import bcrypt from "bcrypt";
import Volunteer from "../models/Volunteer.js";

export const listVolunteers = async (req, res, next) => {
  try {
    const volunteers = await Volunteer.findAll({
      order: [["createdAt", "DESC"]],
    });
    const data = volunteers.map((v) => ({
      id: v.id,
      first_name: v.first_name,
      last_name: v.last_name,
      full_name: `${v.first_name} ${v.last_name}`.trim(),
      email: v.email,
      role: v.role, // String, not array
      status: v.status || "active",
      createdAt: v.createdAt
        ? new Date(v.createdAt).toISOString().split("T")[0]
        : null,
    }));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getVolunteer = async (req, res, next) => {
  try {
    const v = await Volunteer.findByPk(req.params.id);
    if (!v) return res.status(404).json({ message: "Volunteer not found" });
    res.status(200).json({
      id: v.id,
      first_name: v.first_name,
      last_name: v.last_name,
      full_name: `${v.first_name} ${v.last_name}`.trim(),
      email: v.email,
      role: v.role, // String, not array
      status: v.status || "active",
      createdAt: v.createdAt
        ? new Date(v.createdAt).toISOString().split("T")[0]
        : null,
    });
  } catch (err) {
    next(err);
  }
};

export const createVolunteer = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, role, status } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existing = await Volunteer.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const v = await Volunteer.create({
      first_name,
      last_name,
      email,
      password: hashed,
      role: role || "foster",
      status: status ? status.toLowerCase() : "active",
    });
    res.status(201).json({
      id: v.id,
      first_name: v.first_name,
      last_name: v.last_name,
      name: `${v.first_name} ${v.last_name}`.trim(),
      email: v.email,
      role: [v.role],
      status: v.status
        ? v.status.charAt(0).toUpperCase() + v.status.slice(1)
        : "Active",
      createdAt: v.createdAt
        ? new Date(v.createdAt).toISOString().split("T")[0]
        : null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateVolunteer = async (req, res, next) => {
  try {
    const { role, status, first_name, last_name } = req.body;
    const v = await Volunteer.findByPk(req.params.id);
    if (!v) return res.status(404).json({ message: "Volunteer not found" });

    if (role) v.role = role;
    if (status) v.status = status.toLowerCase();
    if (first_name) v.first_name = first_name;
    if (last_name) v.last_name = last_name;

    await v.save();
    res.status(200).json({
      id: v.id,
      first_name: v.first_name,
      last_name: v.last_name,
      name: `${v.first_name} ${v.last_name}`.trim(),
      email: v.email,
      role: [v.role],
      status: v.status
        ? v.status.charAt(0).toUpperCase() + v.status.slice(1)
        : "Active",
      createdAt: v.createdAt
        ? new Date(v.createdAt).toISOString().split("T")[0]
        : null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVolunteer = async (req, res, next) => {
  try {
    const v = await Volunteer.findByPk(req.params.id);
    if (!v) return res.status(404).json({ message: "Volunteer not found" });

    // Prevent self-deletion for admins
    if (req.user && req.user.sub === v.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await v.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Get total count of all volunteers (public)
export const getTotalVolunteersCount = async (req, res, next) => {
  try {
    const count = await Volunteer.count();
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};
