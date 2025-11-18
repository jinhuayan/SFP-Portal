import { validationResult } from "express-validator";
import Application from "../models/Application.js";
import Animal from "../models/Animal.js";
import Volunteer from "../models/Volunteer.js";
import { sendApplicationConfirmationEmail, sendNewApplicationNotificationEmail } from "../services/emailService.js";

export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      include: [
        {
          model: Animal,
          attributes: ["unique_id", "name", "species", "image_urls", "status"],
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicationId = parseInt(id);

    const application = await Application.findByPk(applicationId, {
      include: [
        {
          model: Animal,
          attributes: ["unique_id", "name", "species", "image_urls", "status"],
        },
      ],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const getApplicationsByAnimal = async (req, res, next) => {
  try {
    const { animalId } = req.params;

    const applications = await Application.findAll({
      where: { animal_id: animalId },
      include: [
        {
          model: Animal,
          attributes: ["unique_id", "name", "species", "image_urls", "status"],
        },
      ],
    });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { animal_id, ...applicationData } = req.body;

    // Check if animal exists
    const animal = await Animal.findOne({ where: { unique_id: animal_id } });
    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    // Create new application
    const newApplication = await Application.create({
      ...applicationData,
      animal_id: animal_id,
      status: "submitted",
    });

    // Return with details
    const applicationWithDetails = await Application.findByPk(
      newApplication.id,
      {
        include: [
          {
            model: Animal,
            attributes: ["unique_id", "name", "species", "image_urls", "status"],
          },
        ],
      }
    );

    // Send confirmation email (non-blocking)
    sendApplicationConfirmationEmail({
      email: applicationData.email,
      full_name: applicationData.full_name,
      animal_id: animal_id,
      animal_name: animal.name,
      application_id: newApplication.id,
    }).catch(err => {
      console.error('Failed to send confirmation email:', err);
      // Don't fail the request if email fails
    });

    // Send notification emails to admin and interviewers (non-blocking)
    try {
      const recipients = await Volunteer.findAll({
        where: {
          role: ['admin', 'interviewer'],
          status: 'active'
        },
        attributes: ['id', 'first_name', 'last_name', 'email']
      });

      if (recipients.length > 0) {
        const recipientList = recipients.map(r => ({
          name: `${r.first_name} ${r.last_name}`,
          email: r.email
        }));

        sendNewApplicationNotificationEmail({
          applicant_name: applicationData.full_name,
          applicant_email: applicationData.email,
          animal_id: animal_id,
          animal_name: animal.name,
          application_id: newApplication.id,
          phone_number: applicationData.phone_number,
          address: applicationData.address,
        }, recipientList).catch(err => {
          console.error('Failed to send notification emails:', err);
          // Don't fail the request if email fails
        });
      }
    } catch (err) {
      console.error('Failed to fetch recipients for notification emails:', err);
      // Don't fail the request if email fails
    }

    res.status(201).json(applicationWithDetails);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicationId = parseInt(id);
    const { status } = req.body;

    // Role-based authorization: Only admins can approve applications
    if (status === "approved") {
      const userRole = req.user?.role || "";
      const roles = Array.isArray(userRole) ? userRole : [userRole];
      
      if (!roles.includes("admin")) {
        return res.status(403).json({ 
          message: "Only administrators can approve applications" 
        });
      }
    }

    // Find application in database
    const application = await Application.findByPk(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update status
    await application.update({ status });

    // Return with details
    const updatedApplication = await Application.findByPk(applicationId, {
      include: [
        {
          model: Animal,
          attributes: ["unique_id", "name", "species", "image_urls", "status"],
        },
      ],
    });

    res.status(200).json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicationId = parseInt(id);

    // Find application in database
    const application = await Application.findByPk(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Delete from database
    await application.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
