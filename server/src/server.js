const express = require("express");
const session = require("express-session");
var cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.SERVER_PORT || 5000;

var morgan = require("morgan"); // for logging HTTP requests

// Redis
let RedisStore = require("connect-redis")(session);
const { createClient } = require("redis");
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

// MIDDLEWARE
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(express.urlencoded({ extended: false })); //to parse POST bodies
app.use(express.json());
app.use(morgan("dev")); //http logging
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
    name: process.env.COOKIE_NAME,
  })
);

// ROUTES
app.use("/users", require("./routes/users"));

// 404 handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
