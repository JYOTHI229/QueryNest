import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  askedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 
  votes: {
    type: Map,
    of: Number,
    default: {}, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Safe virtuals to avoid errors when votes is undefined
questionSchema.virtual("upvotes").get(function () {
  return this.votes ? [...this.votes.values()].filter((v) => v === 1).length : 0;
});

questionSchema.virtual("downvotes").get(function () {
  return this.votes ? [...this.votes.values()].filter((v) => v === -1).length : 0;
});

export const Question = mongoose.model("Question", questionSchema);
