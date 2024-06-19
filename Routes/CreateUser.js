const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "HaHa";
router.post(
  "/createUser",
  [
    body("email", "Invalid Email").isEmail(),
    body("name", "Invalid Name").isLength({ min: 3 }),
    body("password", "Invalid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array(), success: false });
    }
    const salt = await bcrypt.genSalt(10);
    let secPwd = await bcrypt.hash(req.body.password, salt);
    try {
      const { name, email, location } = req.body;
      await User.create({
        name: name,
        password: secPwd,
        email: email,
        location: location,
      });

      return res.json({ success: true, msg: "Signup Successful" });
    } catch (error) {
      console.log("🚀 ~ router.post ~ error:", error);
      return res.json({ msg: "Something went wrong!!", success: false });
    }
  }
);

router.post(
  "/loginUser",
  [body("email", "Invalid Email").isEmail()],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array(), success: false });
    }
    try {
      const { password, email } = req.body;
      let isUserExist = await User.findOne({ email: email });
      console.log("🚀 ~ isUserExist:", isUserExist);
      if (!isUserExist) {
        return res.status(400).json({
          msg: "User not exist ! Enter valid credentials.",
          success: false,
        });
      }
      const pwdCompare = await bcrypt.compare(password, isUserExist?.password);
      if (!pwdCompare) {
        return res.status(400).json({
          msg: "Invalid password ! Enter valid credentials.",
          success: false,
        });
      }

      const data = {
        user: {
          id: isUserExist.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);

      return res.json({ success: true, msg: "Login Successful", authToken });
    } catch (error) {
      console.log("🚀 ~ router.post ~ error:", error);
      return res.json({ msg: "Something went wrong!!", success: false });
    }
  }
);

module.exports = router;
