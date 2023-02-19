const mongoose = require("mongoose");
const { Schema } = mongoose;

let commonSchema = new Schema(
  {
    visitors: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

let model = mongoose.model("common", commonSchema);
async function initVisitors() {
  model.create({ visitors: 0 }, (result) => {
    console.log(`visitors initialazed ${result}`);
  });
}
module.exports = model;
