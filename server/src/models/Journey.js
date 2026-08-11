import mongoose from "mongoose";

const journeySchema = new mongoose.Schema(
  {
    journeyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: String,
      default: null,
    },

    source: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    destination: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    destinationName: {
      type: String,
      default: "Your destination",
    },

    route: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    eta: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    safetyScore: {
      type: Number,
      default: 87,
    },

    status: {
      type: String,
      enum: [
        "active",
        "completed",
        "cancelled",
        "emergency",
      ],
      default: "active",
    },

    monitoring: {
      type: Boolean,
      default: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Journey = mongoose.model(
  "Journey",
  journeySchema
);

export default Journey;