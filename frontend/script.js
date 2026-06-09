const express = require('express');
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
    next();
});

app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
    res.sendStatus(200);
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const taskSchema = new mongoose.Schema({ text: String, done: Boolean });
const Task = mongoose.model("Task", taskSchema);

app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post("/tasks", async (req, res) => {
    const task = new Task({ text: req.body.text, done: false });
    await task.save();
    res.json(task);
});

app.patch("/tasks/:id", async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, { done: req.body.done }, { new: true });
    res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ deleted: req.params.id });
});

app.listen(3000, () => {
    console.log("Port 3000 connected");
});