import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const journeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    startLocation: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
      address: {
        type: String,
        trim: true
      }
    },

    destination: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
      address: {
        type: String,
        required: true,
        trim: true
      }
    },

    currentLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: Date
    },

    locationHistory: {
      type: [locationSchema],
      default: []
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active"
    },

    safetyStatus: {
      type: String,
      enum: ["normal", "warning", "alert"],
      default: "normal"
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Journey = mongoose.model("Journey", journeySchema);

export default Journey;