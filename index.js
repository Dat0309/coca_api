import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/userRouter.js";
import drinkRouter from "./Routes/drinkRouter.js";

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Content-Length, Authorization, Accept, yourHeaderField"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// API
app.use("/api/v1/import", ImportData);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/drink", drinkRouter);

app.get("/api/config/paypal", (req, res) => {
  res.send(
    "AfEEBH8yO1b1MiaE-b6MhwdqQne68F5rzZdDWWH0GI-6bCx6sQlfB2Zg_tchgzusJh9yzHTaYJ49DVHN"
  );
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`server run in port ${PORT}`));
