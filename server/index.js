import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";

const app = express();
dotenv.config();

// Setting up body parser to properly send requests
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Calls cors as a function to trigger cors? cors NEEDS to be above routes in order for code to work
app.use(cors());

// Route that gets used for routes folder. routes NEEDS to be under cors in order for code to work
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Hello to whats on your mind API");
});

var port = process.env.PORT || 5000;

// Connects to our database, first arg is url provided by mongodb in order to connect to database, second arg is to get no warnings in console
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => console.log(`Server running on port ${port}`))
  )
  .catch((error) => console.log(error));

// Makes sure we don't get any warnings in the console
mongoose.set("useFindAndModify", false);
