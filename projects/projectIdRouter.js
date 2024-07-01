const express = require("express");

const projectIdRouter = express.Router();
const fs = require("fs");

projectIdRouter.get("/team", (req, res) => {
    try {
        const usersBuf = fs.readFileSync("./users/users.json", "utf-8");
        const users = JSON.parse(usersBuf);
        const project = res.locals.project;
        const team = [];
        project.team.forEach(id => {
            const teamMember = users.find(user => user.id === id);
            team.push(teamMember);
        });
        return res.status(200).send(team);
    } catch (err) {
        res.send('Something went wrong while parsing data');
    }
});

projectIdRouter.get("/team/:teamId", (req, res) => {
    try {
        const usersBuf = fs.readFileSync("./users/users.json", "utf-8");
        const users = JSON.parse(usersBuf);
        const project = res.locals.project;

        if (!project.team.includes(parseInt(req.params.teamId))) {
            return res.statusMessage(400).send("this Id is not a member of projects team");
        }
        const teamMember = users.find(user => user.id === parseInt(req.params.teamId));
        return res.status(200).send(teamMember);
    } catch (err) {
        res.send('Something went wrong while parsing data');
    }
});

projectIdRouter.get("/tasks", (req, res) => {
    try {
        const tasksBuf = fs.readFileSync("./tasks/tasks.json", "utf-8");
        const tasks = JSON.parse(tasksBuf);
        const project = res.locals.project;
        const tasksArr = [];
        project.tasks.forEach(id => {
            const task = tasks.find(task => task.id === id);
            tasksArr.push(task);
        });
        return res.status(200).send(tasksArr);
    } catch (err) {
        res.send('Something went wrong while parsing data');
    }
});

projectIdRouter.get("/tasks/:taskId", (req, res) => {
    try {
        const tasksBuf = fs.readFileSync("./tasks/tasks.json", "utf-8");
        const tasks = JSON.parse(tasksBuf);
        const project = res.locals.project;

        if (!project.tasks.includes(parseInt(req.params.taskId))) {
            return res.status(400).send("this project does not have this task");
        }
        const task = tasks.find(task => task.id === parseInt(req.params.taskId));
        return res.status(200).send(task);
    } catch (err) {
        res.send('Something went wrong while parsing data');
    }
})

module.exports = projectIdRouter;