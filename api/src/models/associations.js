import Animal from "./Animal.js";
import Volunteer from "./Volunteer.js";
import Application from "./Application.js";
import Interview from "./Interview.js";
import Contract from "./Contract.js";
import AnimalPhoto from "./AnimalPhoto.js";
import AuditLog from "./AuditLog.js";
import EmailLog from "./EmailLog.js";

// Define Sequelize model associations (foreign key relationships)
// Note: Animal uses composite PK (id, unique_id); references target 'unique_id'

// Animal relations
Animal.belongsTo(Volunteer, { foreignKey: "volunteer_id" }); // Uploaded by volunteer
Animal.hasMany(AnimalPhoto, { foreignKey: "animal_id" }); // Multiple photos per animal

// Applications
Application.belongsTo(Animal, {
  foreignKey: "animal_id",
  targetKey: "unique_id", // Application refs Animal.unique_id, not id
});

// Interview
Interview.belongsTo(Application, { foreignKey: "application_id" }); // One interview per application
Interview.belongsTo(Volunteer, { foreignKey: "volunteer_id" }); // Assigned to interviewer volunteer

// Contract
Contract.belongsTo(Application, { foreignKey: "application_id" }); // One contract per application
Contract.belongsTo(Animal, { foreignKey: "animal_id", targetKey: "unique_id" }); // Contract references Animal.unique_id

// Audit & Email logs
// AuditLog - no foreign key relationships for now
// EmailLog - no associations required; linked via payload if needed

export default function setupAssociations() {
  // Associations are defined above
}
