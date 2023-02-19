const express = require("express");
const router = express.Router();

router.get("*", (req, res, next) => {
  console.log("qwe");
  next();
});

router.get("/deneme", (req, res) => {
  res.send("deneme");
});

module.exports = router;
