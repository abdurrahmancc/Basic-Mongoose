const router = require("express").Router();
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  console.log(req.body);
});

module.exports = router;
