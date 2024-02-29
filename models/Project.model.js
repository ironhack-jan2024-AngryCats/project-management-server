const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: "New Project",
  },
  description: {
    type: String
  },
  tasks: {
    type: [String],
    default: []
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  collaborators: {
    type: [String]
  },
  documentation: {
    type: [String]
  }
  }

);


module.exports = model("Project", projectSchema);
