var express = require("express");
var router = express.Router();
const controller = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, controller.getUsers); // Get all users
router.get("/me", checkAuth, controller.me); // et myself/current user
router.post("/login", controller.login); // log in user
router.get("/logout", controller.logout); // log out user
router.post("/register", controller.register); //register user
router.get("/:userId(\\d+)", checkAuth, controller.getUserById); //Get user by id

module.exports = router;
