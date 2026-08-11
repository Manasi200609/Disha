import mongoose from "mongoose";

const trustedContactSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true
      },

      phone: {
        type: String,
        required: true,
        trim: true
      }
    },
    {
      timestamps: true
    }
  );


export default mongoose.model(
  "TrustedContact",
  trustedContactSchema
);