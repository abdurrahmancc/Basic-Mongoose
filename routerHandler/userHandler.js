const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

// signup
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      password: hashedPassword,
      status: req.body.status,
    });
    await newUser.save();
    res.status(200).json({ message: "signup was successfully" });
  } catch (error) {
    res.status(500).json({ message: "signup failed" });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ userName: req.body.userName });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
      if (isValidPassword) {
        var token = jwt.sign(
          { userName: user[0].userName, userId: user[0]._id },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.status(200).json({ token: token, message: "Login successfully" });
      }
    } else {
      res.status(401).json({ error: "authentication failed" });
    }
  } catch (error) {
    res.status(401).json({ error: "authentication failed" });
  }
});

//get all user populate
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ status: "active" }).populate("todos");
    res.status(200).json({ user: users, message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "There was an error on tha server side" });
  }
});

module.exports = router;
