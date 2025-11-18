import { sequelize } from "../config/database.js";
import dotenv from "dotenv";

import "../models/index.js";

// Load environment variables
dotenv.config();

const runMigrations = async () => {
  try {
    console.log("🚀 Running database migrations...");
    console.log("📋 This will create all tables including:");
    console.log("   - Animals, Applications, Volunteers");
    console.log("   - Contracts (with token-based signing feature)");
    console.log("   - Interviews, EmailLogs, AuditLogs");
    console.log("");
    console.log(
      "⚠️  This will drop and recreate all tables - ALL DATA WILL BE LOST!"
    );
    console.log("⏳ Waiting 3 seconds... (Ctrl+C to cancel)");
    console.log("");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Drop stale ENUMs
    await sequelize.query("DROP TYPE IF EXISTS enum_animals_status CASCADE;");
    await sequelize.query("DROP TYPE IF EXISTS enum_animals_sex CASCADE;");
    await sequelize.query("DROP TYPE IF EXISTS enum_animals_size CASCADE;");
    await sequelize.query("DROP TYPE IF EXISTS enum_volunteers_role CASCADE;");
    await sequelize.query(
      "DROP TYPE IF EXISTS enum_volunteers_status CASCADE;"
    );
    console.log("✓ Dropped old enum types");

    // FORCE SYNC — drops + recreates all tables
    await sequelize.sync({ force: true });

    console.log("✅ Database schema recreated successfully!");
    console.log("");
    console.log("📝 Next steps:");
    console.log("  1. Seed volunteers: node src/seeds/seedVolunteers.js");
    console.log("  2. Seed animals:    node src/seeds/seedAnimals.js");
    console.log("  3. (Optional) Seed applications: node src/seeds/seedApplications.js");
    console.log("");
    console.log("✨ All tables created including contract token features!");
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
};

runMigrations();
