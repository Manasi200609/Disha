import mongoose from "mongoose";

const trustedContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    relationship: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const TrustedContact = mongoose.model(
  "TrustedContact",
  trustedContactSchema
);

export default TrustedContact;