require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/user")
const connect = require("./db/connect");
const cors = require("cors");
const xss = require("xss-clean")
const helmet = require("helmet")
const rateLimiter = require("express-rate-limit")
const cookieParser = require("cookie-parser");
const notFound = require("./middleware/notfound");
const errorHandlerMiddleware = require("./middleware/errorhandler");
// Middlewares
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(xss())
app.use(helmet())
app.use(rateLimiter({
  windowMs:10*60*1000,
  max:800
}))

app.use(router)

// Error Handling Middleware
app.use(errorHandlerMiddleware);

// Start Server
async function start() {
  const port = process.env.PORT || 4000;
  try {
    await connect(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

start();
