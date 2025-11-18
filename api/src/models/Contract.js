import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Animal from "./Animal.js";
import Application from "./Application.js";

const Contract = sequelize.define(
  "Contract",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "applications",
        key: "id",
      },
    },
    animal_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "animals",
        key: "unique_id",
      },
    },
    adoption_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    payment_proof: {
      type: DataTypes.TEXT,
      allowNull: true, // Will be filled when contract is signed
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: true, // Will be filled when contract is signed
    },
    contract_token: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },
    token_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    token_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    tableName: "contracts",
  }
);

// Define associations
Contract.belongsTo(Application, { foreignKey: "application_id" });
Contract.belongsTo(Animal, { foreignKey: "animal_id", targetKey: "unique_id" });

export default Contract;
