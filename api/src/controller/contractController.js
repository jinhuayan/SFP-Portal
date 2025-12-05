import { validationResult } from "express-validator";
import Contract from "../models/Contract.js";
import Animal from "../models/Animal.js";
import Application from "../models/Application.js";
import { sendContractCompletionEmail } from "../services/emailService.js";

export const getAllContracts = async (req, res, next) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        {
          model: Application,
          attributes: ["id", "full_name", "email", "status"],
        },
        { model: Animal, attributes: ["unique_id", "name", "species"] },
      ],
    });

    res.status(200).json(contracts);
  } catch (error) {
    next(error);
  }
};

export const getContractById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contractId = parseInt(id);

    const contract = await Contract.findByPk(contractId, {
      include: [
        {
          model: Application,
          attributes: ["id", "full_name", "email", "status"],
        },
        { model: Animal, attributes: ["unique_id", "name", "species"] },
      ],
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};

export const getContractsByAnimal = async (req, res, next) => {
  try {
    const { animalId } = req.params;

    const contracts = await Contract.findAll({
      where: { animal_id: animalId },
      include: [
        { model: Animal, attributes: ["unique_id", "name", "species"] },
      ],
    });

    res.status(200).json(contracts);
  } catch (error) {
    next(error);
  }
};

export const createContract = async (req, res, next) => {
  try {
    // Validate request body against schema
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { application_id, ...contractData } = req.body;

    // Fetch application and related animal before contract creation
    const application = await Application.findByPk(application_id, {
      include: [{ model: Animal, attributes: ["unique_id"] }],
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Create contract with foreign keys from application data
    const newContract = await Contract.create({
      ...contractData,
      application_id: application_id,
      animal_id: application.animal_id, // Copy animal_id from application
    });

    // Return with details
    const contractWithDetails = await Contract.findByPk(newContract.id, {
      include: [
        {
          model: Application,
          attributes: ["id", "full_name", "email", "status"],
        },
        { model: Animal, attributes: ["unique_id", "name", "species"] },
      ],
    });

    res.status(201).json(contractWithDetails);
  } catch (error) {
    next(error);
  }
};

export const updateContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contractId = parseInt(id);
    const updateData = req.body;

    // Find contract in database
    const contract = await Contract.findByPk(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // Update contract
    await contract.update(updateData);

    // Return with details
    const updatedContract = await Contract.findByPk(contractId, {
      include: [
        {
          model: Application,
          attributes: ["id", "full_name", "email", "status"],
        },
        { model: Animal, attributes: ["unique_id", "name", "species"] },
      ],
    });

    res.status(200).json(updatedContract);
  } catch (error) {
    next(error);
  }
};

export const deleteContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contractId = parseInt(id);

    // Find contract in database
    const contract = await Contract.findByPk(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // Delete from database
    await contract.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get contract by one-time token (for adopters to access their contract)
 */
export const getContractByToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Find contract by token
    const contract = await Contract.findOne({
      where: { contract_token: token },
      include: [
        {
          model: Application,
          attributes: [
            "id",
            "full_name",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "zip_code",
            "status",
          ],
        },
        {
          model: Animal,
          attributes: [
            "unique_id",
            "name",
            "species",
            "breed",
            "age",
            "adoption_fee",
            "image_urls",
          ],
        },
      ],
    });

    if (!contract) {
      return res.status(404).json({
        message: "Contract not found. The link may be invalid or expired.",
      });
    }

    // Check if token has been used
    if (contract.token_used) {
      return res.status(403).json({
        message:
          "This contract link has already been used. Please contact us if you need assistance.",
      });
    }

    // Check if token has expired
    if (
      contract.token_expires_at &&
      new Date() > new Date(contract.token_expires_at)
    ) {
      return res.status(403).json({
        message:
          "This contract link has expired. Please contact us to request a new link.",
      });
    }

    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};

/**
 * Submit contract with token (for adopters)
 */
export const submitContractByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { payment_proof, signature } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    if (!payment_proof || !signature) {
      return res.status(400).json({
        message: "Payment proof and signature are required",
      });
    }

    // Find contract by token
    const contract = await Contract.findOne({
      where: { contract_token: token },
      include: [
        {
          model: Application,
          attributes: ["id", "full_name", "email", "status"],
        },
        {
          model: Animal,
          attributes: ["unique_id", "name", "species", "adoption_fee"],
        },
      ],
    });

    if (!contract) {
      return res.status(404).json({
        message: "Contract not found. The link may be invalid or expired.",
      });
    }

    // Check if token has been used
    if (contract.token_used) {
      return res.status(403).json({
        message: "This contract link has already been used.",
      });
    }

    // Check if token has expired
    if (
      contract.token_expires_at &&
      new Date() > new Date(contract.token_expires_at)
    ) {
      return res.status(403).json({
        message: "This contract link has expired.",
      });
    }

    // Update contract with submission data and mark token as used
    await contract.update({
      payment_proof,
      signature,
      token_used: true,
    });

    // Update animal status to "adopted" (now that contract is signed)
    try {
      const animal = await Animal.findOne({
        where: { unique_id: contract.Animal.unique_id },
      });
      if (animal) {
        await animal.update({ status: "adopted" });
        console.log(
          `🏠 Animal ${animal.unique_id} status changed to "adopted" (contract signed)`
        );

        // Reject all other applications for this animal
        try {
          const allApplications = await Application.findAll({
            where: { animal_id: animal.unique_id },
          });

          let rejectedCount = 0;
          for (const app of allApplications) {
            // Reject applications that are not this one and not already rejected/approved
            if (
              app.id !== contract.application_id &&
              app.status !== "rejected" &&
              app.status !== "approved"
            ) {
              await app.update({ status: "rejected" });
              rejectedCount++;
            }
          }

          if (rejectedCount > 0) {
            console.log(
              `📧 ${rejectedCount} other application(s) automatically rejected for ${animal.unique_id}`
            );
          }
        } catch (rejectionError) {
          console.error(
            "⚠️  Failed to reject other applications:",
            rejectionError
          );
          // Don't fail the main request if this fails
        }
      }
    } catch (animalError) {
      console.error(
        "⚠️  Contract saved but animal status update failed:",
        animalError
      );
      // Don't fail the request if animal status update fails
    }

    // Send contract completion email
    try {
      await sendContractCompletionEmail({
        adopter_name: contract.Application.full_name,
        adopter_email: contract.Application.email,
        animal_name: contract.Animal.name,
        animal_id: contract.Animal.unique_id,
        contract_id: contract.id,
        adoption_fee: contract.Animal.adoption_fee,
        signed_date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
      console.log(
        `✅ Contract completed for ${contract.Application.full_name} - ${contract.Animal.name}`
      );
    } catch (emailError) {
      console.error("⚠️  Contract saved but email failed:", emailError);
      // Don't fail the request if email fails
    }

    // Return updated contract
    const updatedContract = await Contract.findByPk(contract.id, {
      include: [
        {
          model: Application,
          attributes: ["id", "full_name", "email", "status"],
        },
        {
          model: Animal,
          attributes: ["unique_id", "name", "species"],
        },
      ],
    });

    res.status(200).json({
      message: "Contract submitted successfully!",
      contract: updatedContract,
    });
  } catch (error) {
    next(error);
  }
};
