const User = require("../models/user");
const passport = require("passport");
exports.getLoginPage = (req, res) => {
  return res.render("login");
};

exports.getSignupPage = (req, res) => {
  return res.render("signup");
};

exports.postSignup = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      req.flash("error", "User already exists!");
      return res.redirect("/admin/signup");
    }

    const newUser = new User({ username, name });
    const user = await User.register(newUser, password);

    if (!user) {
      req.flash("error", "Signup Failed!");
      return res.redirect("/admin/signup");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to HAB Portal!");
      return res.redirect("/admin");
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Logged out successfully!");
  return res.redirect("/admin/login");
};

exports.getUsers = async (req, res) => {
  const users = await User.find({});
  return res.render("users/index", { users });
};

exports.changeAdmin = async (req, res) => {
  try {
    const id = req.params.user_id;
    const user = await User.findById(id);
    if (!user) {
      req.flash("error", "User doesn't exist!");
      return res.redirect("/admin/users");
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    req.flash("success", "Admin status changed!");
    return res.redirect("/admin/users");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/admin");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.user_id;
    await User.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted user");
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error.message);
    return res.redirect("/admin");
  }
};
