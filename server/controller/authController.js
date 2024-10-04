const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    if (!username || !password || !name || !email) {
      return res
        .status(400)
        .json({ status: "error", error: "Please Provide All feilds" });
    }
    const foundUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (foundUser) {
      if (foundUser.username === username) {
        return res
          .status(400)
          .json({ status: "error", error: "Username is Already Taken" });
      }
      return res
        .status(400)
        .json({ status: "error", error: "Email is Already Taken" });
    }
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);
    const userData = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        id: userData._id,
        username,
        name: userData.name,
        email: userData.email,
      },
      process.env.SECRET_KEY,
      {}
    );
    res
      .cookie("token", token, { sameSite: "none", secure: true })
      .status(200)
      .json({
        status: "success",
        userId: userData._id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
      });
  } catch (error) {
    console.log(`Error : `, error);
    res.status(500).json({ status: "error", error: error });
  }
};

const login = async (req, res) => {
  try {
    const { username : usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ status: "error", error: "Please provide all fields" });
    }

    const userData = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!userData) {
      return res
        .status(400)
        .json({ status: "error", error: "Username or Email not found" });
    }

    // Continue with password verification

    const isMatch = bcryptjs.compareSync(password, userData.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: userData._id,
        username:userData.username,
        name: userData.name,
        email: userData.email,
      },
      process.env.SECRET_KEY,
      {}
    );
    res
      .cookie("token", token, { sameSite: "none", secure: true })
      .status(200)
      .json({
        status: "success",
        userId: userData._id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
      });
  } catch (error) {
    console.log(`Error : `, error);
    res.status(500).json({ status: "error", error: error });
  }
};

const profile = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ status: "error", error: "Not authenticated" });
    }

    jwt.verify(token, process.env.SECRET_KEY, {}, (err, userData) => {
      if (err) {
        return res
          .status(401)
          .json({ status: "error", error: "Invalid token" });
      }

      res.status(200).json(userData);
    });
  } catch (error) {
    console.log(`Error : `, error);
    res.status(500).json({ status: "error", error: error });
  }
};

const people = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", error: "Not authenticated" });
  }

  try {
    const users = await User.find({}, { _id: 1, name: 1 });
    res.status(200).json(users);
  } catch (error) {
    console.log(`Error : `, error);
    res.status(500).json({ status: "error", error: error });
  }
};

const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ status: "success", message: "Logged out" });
};

module.exports = {
  register,
  profile,
  login,
  people,
  logout,
};
