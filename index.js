const { json } = require("express");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;
//connecting to MongoDB
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => console.log(err));

const todoSchema = mongoose.Schema({
  title: { type: String, required: true },
  discription: { type: String, required: true },
  isCompleted: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});

const TODO = mongoose.model("TODO", todoSchema);
//express server
const app = express();
//json middleware
app.use(json());
//home route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});
//fetch all todos
app.get("/api/todos", async (req, res) => {
  try {
    const allTodos = await TODO.find();
    res.send(allTodos);
  } catch (err) {
    res.status(404).send(err);
  }
});

//crete new todo
app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = new TODO({
      title: req.body.title,
      discription: req.body.discription,
    });
    const newT = await newTodo.save();
    res.send(newT);
  } catch (err) {
    res.status(404).send(err);
  }
});

//update the existing todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const updateId = req.params.id;
    const updateTodo = await TODO.findByIdAndUpdate(updateId, req.body);
    res.send(updateTodo);
  } catch (err) {
    res.status(404).send(err);
  }
});

//delete one todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deleteId = req.params.id;
    const deletedTodo = await TODO.findByIdAndDelete(deleteId);
    res.send(deletedTodo);
  } catch (err) {
    res.status(404).send(err);
  }
});
app.listen(8080, () => console.log("server listening on port 8080"));
