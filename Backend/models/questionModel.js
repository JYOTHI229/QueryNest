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
  // ✅ Only a single "votes" Map
  votes: {
    type: Map,
    of: Number, // 1 for upvote, -1 for downvote
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

// ✅ Virtuals — don't conflict with real fields
questionSchema.virtual("upvotes").get(function () {
  return [...this.votes.values()].filter((v) => v === 1).length;
});

questionSchema.virtual("downvotes").get(function () {
  return [...this.votes.values()].filter((v) => v === -1).length;
});

export const Question = mongoose.model("Question", questionSchema);
