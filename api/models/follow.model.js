import mongoose from "mongoose";
const { Schema } = mongoose;

const followSchema = new Schema({
  followerId: {
    type: String,
    required: true,
  },
  followedId: {
    type: String,
    required: true,
  },
},{
  timestamps: true
});

// Create a compound index to ensure a user can only follow another user once
followSchema.index({ followerId: 1, followedId: 1 }, { unique: true });

export default mongoose.model("Follow", followSchema);