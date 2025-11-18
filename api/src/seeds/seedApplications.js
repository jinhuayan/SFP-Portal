import "dotenv/config";
import sequelize from "../config/database.js";
import { Application, Animal } from "../models/index.js";

async function seedApplications() {
  try {
    await sequelize.authenticate();

    // Ensure we have some animals to attach applications to
    const animals = await Animal.findAll({ attributes: ["unique_id", "name"] });
    if (!animals || animals.length === 0) {
      console.error("❌ No animals found — seed animals first!");
      process.exit(1);
    }

    // Use only IDs that existed in seedAnimals.js
    const existingAnimalIds = new Set(animals.map((a) => a.unique_id));

    const applications = [
      // Cat applications
      {
        animal_id: "SFP-001",
        status: "submitted",
        full_name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "123-456-7890",
        address: "123 Maple St",
        city: "Toronto",
        state: "ON",
        zip_code: "M4B 1B3",
        household_type: "house",
        has_children: true,
        children_ages: "7, 10",
        has_other_pets: false,
        other_pets_details: null,
        experience_with_pets: "moderate",
        hours_away: "4-6",
        reason_for_adoption: "Looking for a family companion.",
        emergency_contact_name: "Tom Johnson",
        emergency_contact_phone: "123-456-7891",
        agreed_to_terms: true,
      },
      {
        animal_id: "SFP-002",
        status: "under_review",
        full_name: "Michael Chen",
        email: "michael.chen@example.com",
        phone: "234-567-8901",
        address: "55 King St",
        city: "Markham",
        state: "ON",
        zip_code: "L3R 2G6",
        household_type: "apartment",
        has_children: false,
        children_ages: "",
        has_other_pets: true,
        other_pets_details: "One cat (2 years old)",
        experience_with_pets: "high",
        hours_away: "0-2",
        reason_for_adoption: "Companion for existing pet.",
        emergency_contact_name: "Alice Chen",
        emergency_contact_phone: "289-555-2200",
        agreed_to_terms: true,
      },
      {
        animal_id: "SFP-003",
        status: "submitted",
        full_name: "Emily Wilson",
        email: "emily.wilson@example.com",
        phone: "345-678-9012",
        address: "901 Pine Ave",
        city: "Richmond Hill",
        state: "ON",
        zip_code: "L4B 2A1",
        household_type: "condo",
        has_children: false,
        children_ages: "",
        has_other_pets: false,
        other_pets_details: null,
        experience_with_pets: "low",
        hours_away: "6-8",
        reason_for_adoption: "First-time adopter, quiet home.",
        emergency_contact_name: "Mark Wilson",
        emergency_contact_phone: "416-555-9012",
        agreed_to_terms: true,
      },

      // Dog applications
      {
        animal_id: "SFP-004",
        status: "interview_scheduled",
        full_name: "Daniel Park",
        email: "daniel.park@example.com",
        phone: "416-222-1111",
        address: "11 Lakeshore Rd",
        city: "Mississauga",
        state: "ON",
        zip_code: "L5B 4N2",
        household_type: "house",
        has_children: true,
        children_ages: "3",
        has_other_pets: false,
        other_pets_details: null,
        experience_with_pets: "moderate",
        hours_away: "2-4",
        reason_for_adoption: "Active family looking for a playful dog.",
        emergency_contact_name: "Jisun Park",
        emergency_contact_phone: "647-555-2020",
        agreed_to_terms: true,
      },
      {
        animal_id: "SFP-005",
        status: "approved",
        full_name: "Priya Singh",
        email: "priya.singh@example.com",
        phone: "437-777-3333",
        address: "77 Queen St",
        city: "Toronto",
        state: "ON",
        zip_code: "M5H 2M5",
        household_type: "townhouse",
        has_children: false,
        children_ages: "",
        has_other_pets: true,
        other_pets_details: "Small senior dog (10 years)",
        experience_with_pets: "high",
        hours_away: "0-2",
        reason_for_adoption: "Experienced owner, wants a companion.",
        emergency_contact_name: "Aman Singh",
        emergency_contact_phone: "905-555-7878",
        agreed_to_terms: true,
      },
      {
        animal_id: "SFP-006",
        status: "rejected",
        full_name: "Lucas Meyer",
        email: "lucas.meyer@example.com",
        phone: "905-333-2222",
        address: "22 Bloor St",
        city: "Toronto",
        state: "ON",
        zip_code: "M4W 1A1",
        household_type: "apartment",
        has_children: false,
        children_ages: "",
        has_other_pets: false,
        other_pets_details: null,
        experience_with_pets: "low",
        hours_away: "8+",
        reason_for_adoption: "Wants a first pet.",
        emergency_contact_name: "Nora Meyer",
        emergency_contact_phone: "647-555-9090",
        agreed_to_terms: true,
      },

      // Small animals / store partners
      {
        animal_id: "SFP-007",
        status: "submitted",
        full_name: "Olivia Martin",
        email: "olivia.martin@example.com",
        phone: "416-909-1111",
        address: "10 Finch Ave",
        city: "North York",
        state: "ON",
        zip_code: "M2N 6L9",
        household_type: "apartment",
        has_children: false,
        children_ages: "",
        has_other_pets: false,
        other_pets_details: null,
        experience_with_pets: "moderate",
        hours_away: "2-4",
        reason_for_adoption: "Looking for a small, calm pet.",
        emergency_contact_name: "Eric Martin",
        emergency_contact_phone: "416-555-3131",
        agreed_to_terms: true,
      },
      {
        animal_id: "SFP-008",
        status: "under_review",
        full_name: "Hannah Lee",
        email: "hannah.lee@example.com",
        phone: "437-111-2222",
        address: "300 Steeles Ave",
        city: "Vaughan",
        state: "ON",
        zip_code: "L4K 5H2",
        household_type: "house",
        has_children: true,
        children_ages: "12, 15",
        has_other_pets: false,
        other_pets_details: null,
        experience_with_pets: "high",
        hours_away: "0-2",
        reason_for_adoption: "Family pet for kids.",
        emergency_contact_name: "David Lee",
        emergency_contact_phone: "905-555-6622",
        agreed_to_terms: true,
      },
      {
        animal_id: "SFP-009",
        status: "interview_scheduled",
        full_name: "Ahmed Hassan",
        email: "ahmed.hassan@example.com",
        phone: "289-222-4444",
        address: "77 16th Ave",
        city: "Markham",
        state: "ON",
        zip_code: "L3R 0A1",
        household_type: "townhouse",
        has_children: false,
        children_ages: "",
        has_other_pets: true,
        other_pets_details: "Two cats (3 and 5 years)",
        experience_with_pets: "high",
        hours_away: "2-4",
        reason_for_adoption: "Add a calm cat to the family.",
        emergency_contact_name: "Omar Hassan",
        emergency_contact_phone: "416-555-4545",
        agreed_to_terms: true,
      },
      {
        animal_id: "SFP-010",
        status: "submitted",
        full_name: "Julia Novak",
        email: "julia.novak@example.com",
        phone: "647-000-5555",
        address: "12 Yonge St",
        city: "Toronto",
        state: "ON",
        zip_code: "M5E 1Z9",
        household_type: "condo",
        has_children: false,
        children_ages: "",
        has_other_pets: false,
        other_pets_details: null,
        experience_with_pets: "moderate",
        hours_away: "4-6",
        reason_for_adoption: "Quiet companion for city living.",
        emergency_contact_name: "Peter Novak",
        emergency_contact_phone: "416-555-7878",
        agreed_to_terms: true,
      },
    ].filter((a) => existingAnimalIds.has(a.animal_id));

    let createdCount = 0;
    let existingCount = 0;

    for (const app of applications) {
      const [_, created] = await Application.findOrCreate({
        where: {
          animal_id: app.animal_id,
          email: app.email,
          full_name: app.full_name,
        },
        defaults: app,
      });
      if (created) createdCount += 1;
      else existingCount += 1;
    }

    const total = await Application.count();
    console.log(
      `✓ Applications seeding complete: ${createdCount} new, ${existingCount} existing. Total in DB: ${total}`
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding applications:", err);
    process.exit(1);
  }
}

seedApplications();
