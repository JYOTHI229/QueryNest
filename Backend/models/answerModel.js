import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  votes: {
    type: Map,
    of: Number, // userId => 1 or -1
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals for upvote/downvote counts
answerSchema.virtual("upvotes").get(function () {
  return [...this.votes.values()].filter(v => v === 1).length;
});

answerSchema.virtual("downvotes").get(function () {
  return [...this.votes.values()].filter(v => v === -1).length;
});

export default mongoose.model("Answer", answerSchema);
