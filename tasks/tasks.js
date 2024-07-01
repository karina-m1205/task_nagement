const express = require("express");

const tasksRouter = express.Router();
const fs = require("fs");

tasksRouter.post("/", (req, res) => {
    let newTask = req.body;

    fs.readFile('./tasks/tasks.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Task does not exist');
            return res.status(500).send('Internal server error');
        }
        let tasks = [];

        try {
            tasks = JSON.parse(data);
            const findTask = tasks.find(task => task.id === parseInt(newTask.id));
            if (findTask) {
                return res.status(400).send("task already exist");
            }
            tasks.push(newTask);

            fs.writeFile('./tasks/tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add task');
                    return res.status(500).send('Internal server error');
                }
                return res.status(201).send({ message: 'Task created' });
            });
        } catch (err) {
            console.error('Something went wrong while parsing data');
            return res.send(err);
        }
    });
});

tasksRouter.get("/", (req, res) => {
    fs.readFile("./tasks/tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.error("Task does not exist");
            return res.status(500).send("Internal server error");
        }

        try {
            tasks = JSON.parse(data);
            return res.status(200).send(tasks);
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    })
});

tasksRouter.get("/:taskId", (req, res) => {
    fs.readFile("./tasks/tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.error("Task does not exist");
            return res.status(500).send("Internal server error");
        }

        try {
            tasks = JSON.parse(data);
            const task = tasks.find(task => task.id === parseInt(req.params.taskId));
            if (!task) {
                return res.status(400).send("Task does not exist");
            }
            return res.status(200).send(task);
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    })
});

tasksRouter.put("/:taskId", (req, res) => {
    fs.readFile("./tasks/tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.error("Task does not exist");
            return res.status(500).send("Internal server error");
        }

        try {
            tasks = JSON.parse(data);
            const task = tasks.find(task => task.id === parseInt(req.params.taskId));
            if (!task) {
                return res.status(400).send("Task does not exist");
            }

            const { id, title, description, status, assignee, dueDate } = { ...req.body };
            task.id = id;
            task.title = title;
            task.description = description;
            task.status = status;
            task.assignee = assignee;
            task.dueDate = dueDate;

            fs.writeFile("./tasks/tasks.json", JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add changes');
                    return res.status(500).send('Internal server error');
                }
                return res.status(200).send(tasks);
            });
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    })
});

tasksRouter.delete("/:taskId", (req, res) => {
    fs.readFile("./tasks/tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.error("Task does not exist");
            return res.status(500).send("Internal server error");
        }

        try {
            tasks = JSON.parse(data);
            const task = tasks.find(task => task.id === parseInt(req.params.taskId));
            if (!task) {
                return res.status(400).send("Tasks does not exist");
            }
            tasks.splice(tasks.indexOf(task), 1);

            fs.writeFile("./tasks/tasks.json", JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add changes');
                    return res.status(500).send('Internal server error');
                }
            });

            return res.status(200).send({ message: "Task deleted" });
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    })
});

module.exports = tasksRouter; 