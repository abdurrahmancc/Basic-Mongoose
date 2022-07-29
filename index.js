const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routerHandler/todoHandler");
const user = require("./routerHandler/user");

// express app initialization
const app = express();
app.use(express.json());

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("connection success"))
  .catch((err) => console.log(err));

// application routes
app.use("/todo", todoHandler);
app.use("/", user);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(5000, () => {
  console.log("app listening at port 5000");
});
