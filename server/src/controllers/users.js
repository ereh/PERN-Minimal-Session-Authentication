const pool = require("../config/db");
const argon2 = require("argon2");

// HELPER FUNCTIONS
// Gets user by username.
const getUserByUsername = async (username) => {
  const res = await pool.query({
    text: "SELECT * FROM users WHERE username=$1",
    values: [username],
  });
  return res.rows[0];
};

// EXPORTED CONTROLLERS
//Gets all users
const getUsers = async (req, res) => {
  const query = await pool.query("SELECT id, username, email FROM users");
  const users = query.rows;
  return res.status(200).json(users);
};

//Returns currently logged in user.
const me = async (req, res) => {
  const query = await pool.query({
    text: "SELECT id, username, email FROM users WHERE id=$1",
    values: [req.session.user.id],
  });
  const user = query.rows[0];
  return res.status(200).json(user);
};

//Gets user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const query = await pool.query({
    text: "SELECT FROM users WHERE id=$1",
    values: [userId],
  });
  const user = query.rows[0];
  return res.status(200).json(user);
};

//Log user in
const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(401).json({
      error: {
        message: "Username or password missing..",
      },
    });
  }
  const user = await getUserByUsername(username);

  if (!user) {
    return res.status(401).json({
      error: {
        message: "User not found.",
      },
    });
  }

  const authenticated = await argon2.verify(user.password, password);
  delete password;
  delete user.password;
  if (authenticated) {
    req.session.user = user;
    return res.status(200).json(user);
  } else {
    return res.status(401).json({
      error: {
        message: "Incorrect password.",
      },
    });
  }
};

//Logs user out
const logout = (req, res) => {
  req.session.destroy(); //destroy session data on server
  res.clearCookie(process.env.COOKIE_NAME); //clear cookie, this is not really needed.
  return res.status(200).json({
    message: "Success",
  });
};

//Registers new user
const register = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const hash = await argon2.hash(password);
  const query = await pool.query(
    "INSERT INTO users(username, email, password) VALUES($1,$2,$3) RETURNING id,username, email",
    [username, email, hash]
  );
  delete password;
  const user = query.rows[0];
  delete user.password;
  req.session.user = user; //log the user in
  return res.status(200).json(user);
};

module.exports = { getUsers, getUserById, login, logout, register, me };
