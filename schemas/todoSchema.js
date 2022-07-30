const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

// custom instance methods (optional)
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "active" });
  },
  findActiveCallback: function (cb) {
    return mongoose.model("Todo").find({ status: "active" }, cb);
  },
};

// custom statics methods (optional)
todoSchema.statics = {
  findByJs: function () {
    return this.find({ title: /js/i });
  },
};

// query helper methods (optional)
todoSchema.query = {
  byLanguage: function (lg) {
    return this.find({ title: new RegExp(lg, "i") });
  },
};

module.exports = todoSchema;
