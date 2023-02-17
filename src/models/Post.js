const mongoose = require("mongoose");
const { Schema } = mongoose;

let postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

let model = mongoose.model("posts", postSchema);
module.exports = model;
