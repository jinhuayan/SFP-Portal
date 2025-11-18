import { validationResult } from "express-validator";
import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Volunteer from "../models/Volunteer.js";
import Animal from "../models/Animal.js";
import { sendInterviewScheduledEmail, sendInterviewUpdatedEmail } from "../services/emailService.js";

// Get all interviews (admin only) or assigned interviews (interviewer)
export const getAllInterviews = async (req, res, next) => {
  try {
    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub; // JWT uses 'sub' for user ID

    let whereClause = {};

    // Interviewers can only see interviews assigned to them
    if (userRole === "interviewer") {
      whereClause = { volunteer_id: userId };
    }
    // Admin can see all interviews (no where clause)

    const interviews = await Interview.findAll({
      where: whereClause,
      include: [
        {
          model: Application,
          attributes: [
            "id",
            "animal_id",
            "status",
            "full_name",
            "email",
            "phone",
          ],
        },
        {
          model: Volunteer,
          attributes: ["id", "first_name", "last_name", "email", "role"],
        },
      ],
      order: [["interview_time", "DESC"]],
    });

    res.status(200).json(interviews);
  } catch (error) {
    next(error);
  }
};

// Get interview by ID (admin sees all, interviewer sees only assigned)
export const getInterviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interviewId = parseInt(id);
    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub; // JWT uses 'sub' for user ID

    const interview = await Interview.findByPk(interviewId, {
      include: [
        {
          model: Application,
          attributes: [
            "id",
            "animal_id",
            "status",
            "full_name",
            "email",
            "phone",
          ],
        },
        {
          model: Volunteer,
          attributes: ["id", "first_name", "last_name", "email", "role"],
        },
      ],
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Interviewer can only see interviews assigned to them
    if (userRole === "interviewer" && interview.volunteer_id !== userId) {
      return res
        .status(403)
        .json({ message: "Access denied: not assigned to this interview" });
    }

    res.status(200).json(interview);
  } catch (error) {
    next(error);
  }
};

// Get interviews by application (admin only)
export const getInterviewsByApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const id = parseInt(applicationId);

    const interviews = await Interview.findAll({
      where: { application_id: id },
      include: [
        {
          model: Application,
          attributes: [
            "id",
            "animal_id",
            "status",
            "full_name",
            "email",
            "phone",
          ],
        },
        {
          model: Volunteer,
          attributes: ["id", "first_name", "last_name", "email", "role"],
        },
      ],
    });

    res.status(200).json(interviews);
  } catch (error) {
    next(error);
  }
};

// Create interview (admin & interviewer) - requires application_id
// If interview already exists for this application, update it instead
export const createInterview = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { application_id, volunteer_id, interview_time } = req.body;
    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub; // JWT uses 'sub' for user ID, not 'id'

    // Check if application exists
    const application = await Application.findByPk(application_id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if interview already exists for this application
    const existingInterview = await Interview.findOne({
      where: { application_id }
    });

    // Determine the volunteer_id to use
    let assignedVolunteerId = volunteer_id;

    // If volunteer_id not provided, use current user's ID (for interviewers)
    if (!assignedVolunteerId) {
      if (userRole === "interviewer") {
        assignedVolunteerId = userId;
      } else if (userRole === "admin") {
        return res.status(400).json({
          message: "Admin must provide volunteer_id to assign an interviewer",
        });
      }
    }

    // Check if volunteer (interviewer) exists
    const volunteer = await Volunteer.findByPk(assignedVolunteerId);
    if (!volunteer) {
      console.error(
        `Volunteer not found - ID: ${assignedVolunteerId}, Role: ${userRole}, userId from token: ${userId}`
      );
      return res.status(404).json({ message: "Interviewer not found" });
    }

    // Ensure selected volunteer has interviewer role
    if (volunteer.role !== "interviewer" && volunteer.role !== "admin") {
      return res.status(400).json({
        message: "Selected volunteer must have interviewer or admin role",
      });
    }

    // Get volunteer name
    const volunteerName = `${volunteer.first_name} ${volunteer.last_name}`;

    let interview;
    let isUpdate = false;

    if (existingInterview) {
      // Update existing interview
      isUpdate = true;
      await existingInterview.update({
        volunteer_id: assignedVolunteerId,
        volunteer_name: volunteerName,
        interview_time: interview_time || existingInterview.interview_time,
        // Keep existing interview_result and final_decision
      });
      interview = existingInterview;
    } else {
      // Create new interview
      interview = await Interview.create({
        application_id,
        volunteer_id: assignedVolunteerId,
        volunteer_name: volunteerName,
        interview_time: interview_time || null,
        interview_result: null,
        final_decision: "pending",
      });
    }

    // Return with details
    const interviewWithDetails = await Interview.findByPk(interview.id, {
      include: [
        {
          model: Application,
          attributes: [
            "id",
            "animal_id",
            "status",
            "full_name",
            "email",
            "phone",
          ],
        },
        {
          model: Volunteer,
          attributes: ["id", "first_name", "last_name", "email", "role"],
        },
      ],
    });

    // Send email notification if interview time is set
    if (interview_time && application) {
      try {
        // Get animal details
        const animal = await Animal.findOne({
          where: { unique_id: application.animal_id },
        });

        if (animal) {
          // Format interview time
          const interviewDate = new Date(interview_time);
          const formattedTime = interviewDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          const emailData = {
            applicant_email: application.email,
            applicant_name: application.full_name,
            animal_name: animal.name,
            animal_id: animal.unique_id,
            interview_date: interviewDate.toISOString().split('T')[0],
            interview_time: formattedTime,
            interview_location: req.body.interview_location || 'SFP Office',
            interview_notes: req.body.interview_notes || '',
            interviewer_name: volunteerName,
            interviewer_email: volunteer.email,
          };

          // Send scheduled or updated email based on whether this was an update
          if (isUpdate) {
            await sendInterviewUpdatedEmail(emailData);
          } else {
            await sendInterviewScheduledEmail(emailData);
          }
        }
      } catch (emailError) {
        console.error('Failed to send interview email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(isUpdate ? 200 : 201).json(interviewWithDetails);
  } catch (error) {
    next(error);
  }
};

// Update interview (different logic for admin vs interviewer)
export const updateInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interviewId = parseInt(id);
    const userRole = String(req.user?.role || "").toLowerCase();
    const userId = req.user?.sub; // JWT uses 'sub' for user ID

    const { interview_time, interview_result, final_decision } = req.body;

    // Find interview in database
    const interview = await Interview.findByPk(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Interviewer can only update interviews assigned to them
    if (userRole === "interviewer" && interview.volunteer_id !== userId) {
      return res
        .status(403)
        .json({ message: "Access denied: not assigned to this interview" });
    }

    const updates = {};

    // Interview time: can be set and updated
    if (interview_time !== undefined) {
      updates.interview_time = interview_time;
    }

    // Interview result: interviewer can set, admin can modify
    if (interview_result !== undefined) {
      updates.interview_result = interview_result;
    }

    // Final decision: only admin can set
    if (final_decision !== undefined) {
      if (userRole !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admin can set final decision" });
      }
      if (!["pending", "approved", "rejected"].includes(final_decision)) {
        return res
          .status(400)
          .json({ message: "Invalid final decision value" });
      }
      updates.final_decision = final_decision;
    }

    // Update interview
    await interview.update(updates);

    // Return with details
    const updatedInterview = await Interview.findByPk(interviewId, {
      include: [
        {
          model: Application,
          attributes: [
            "id",
            "animal_id",
            "status",
            "full_name",
            "email",
            "phone",
          ],
        },
        {
          model: Volunteer,
          attributes: ["id", "first_name", "last_name", "email", "role"],
        },
      ],
    });

    // Send email notification if interview time was just set or changed
    if (interview_time && updatedInterview.Application) {
      try {
        const application = updatedInterview.Application;
        
        // Get animal details
        const animal = await Animal.findOne({
          where: { unique_id: application.animal_id },
        });

        // Get volunteer details
        const volunteer = updatedInterview.Volunteer;

        if (animal && volunteer) {
          // Format interview time
          const interviewDate = new Date(interview_time);
          const formattedTime = interviewDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          const emailData = {
            applicant_email: application.email,
            applicant_name: application.full_name,
            animal_name: animal.name,
            animal_id: animal.unique_id,
            interview_date: interviewDate.toISOString().split('T')[0],
            interview_time: formattedTime,
            interview_location: req.body.interview_location || 'SFP Office',
            interview_notes: req.body.interview_notes || '',
            interviewer_name: `${volunteer.first_name} ${volunteer.last_name}`,
            interviewer_email: volunteer.email,
          };

          // If this was the first time setting the interview_time, send "scheduled" email
          // Otherwise, send "updated" email
          if (!interview.interview_time) {
            await sendInterviewScheduledEmail(emailData);
          } else {
            await sendInterviewUpdatedEmail(emailData);
          }
        }
      } catch (emailError) {
        console.error('Failed to send interview email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json(updatedInterview);
  } catch (error) {
    next(error);
  }
};

// Delete interview (admin only)
export const deleteInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interviewId = parseInt(id);

    // Find interview in database
    const interview = await Interview.findByPk(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Delete from database
    await interview.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
