const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const usersRouter = require('./users/users');
const projectsRouter = require("./projects/projects");
const tasksRouter = require("./tasks/tasks");
const port = 3001;

// Resources
// 1. projects
// 2. users
// 3. tasks

// app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
// app.use("/tasks", tasksRouter);

app.listen(port, () => {
  console.log(`Server is runing on http://localhost:${port}`);
});
