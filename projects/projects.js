const express = require("express");

const projectsRouter = express.Router();
const fs = require("fs");
const projectIdRouter = require("./projectIdRouter");
// const usersRouter = require("../users/users");
// const tasksRouter = require("../tasks/tasks");

projectsRouter.post("/", (req, res) => {
    let newProject = req.body;

    fs.readFile('./projects/projects.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Project does not exist');
            return res.status(500).send('Internal server error');
        }
        let projects = [];

        try {
            projects = JSON.parse(data);
            const findProject = projects.find(project => project.id === parseInt(newProject.id));
            if (findProject) {
                return res.status(400).send("project already exist");
            }
            projects.push(newProject);

            fs.writeFile('./projects/projects.json', JSON.stringify(projects, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add project');
                    return res.status(500).send('Internal server error');
                }
                return res.status(201).send({ message: 'Project created' });
            });
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    });
});

projectsRouter.get("/", (req, res) => {
    fs.readFile("./projects/projects.json", "utf-8", (err, data) => {
        if (err) {
            console.error("Project does not exist");
            return res.status(500).send("Internal server error");
        }

        try {
            projects = JSON.parse(data);
            return res.status(200).send(projects);
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    })
});


projectsRouter.get("/:projectId", (req, res) => {
    const project = getProjectById(req.params.projectId);
    if (!project) {
        return res.status(400).send("Project does not exist");
    } else {
        return res.status(200).send(project);
    }
});

projectsRouter.put("/:projectId", (req, res) => {
    fs.readFile("./projects/projects.json", "utf-8", (err, data) => {
        if (err) {
            console.error("Project does not exist");
            return res.status(500).send("Internal server error");
        }

        try {
            projects = JSON.parse(data);
            const project = projects.find(project => project.id === parseInt(req.params.projectId));
            if (!project) {
                return res.status(400).send("Project does not exist");
            }

            const { id, name, description, startDate, endDate, status, budget, currency, team, tasks } = { ...req.body };
            project.id = id;
            project.name = name;
            project.description = description;
            project.startDate = startDate;
            project.endDate = endDate;
            project.status = status;
            project.budget = budget;
            project.currency = currency;
            project.team = team;
            project.tasks = tasks;

            fs.writeFile("./projects/projects.json", JSON.stringify(projects, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add changes');
                    return res.status(500).send('Internal server error');
                }
                return res.status(200).send(project);
            });
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    })
});

projectsRouter.delete("/:projectId", (req, res) => {
    fs.readFile("./projects/projects.json", "utf-8", (err, data) => {
        if (err) {
            console.error("Project does not exist");
            return res.status(500).send("Internal server error");
        }

        try {
            projects = JSON.parse(data);
            const project = projects.find(project => project.id === parseInt(req.params.projectId));
            if (!project) {
                return res.status(400).send("Projects does not exist");
            }
            projects.splice(projects.indexOf(project), 1);

            fs.writeFile("./projects/projects.json", JSON.stringify(projects, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add changes');
                    return res.status(500).send('Internal server error');
                }
            });

            return res.status(200).send({ message: "Project deleted" });
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    })
});

projectsRouter.use("/:projectId", (req, res, next) => {
    project = getProjectById(req.params.projectId);
    res.locals.project = project;
    next();
}, projectIdRouter);


// projectsRouter.use("/:projectId/team", usersRouter);
// projectsRouter.use("/:projectId/tasks", tasksRouter);

function getProjectById(projectId) {
    try {
        const projectsBuf = fs.readFileSync("./projects/projects.json", "utf-8");
        const projects = JSON.parse(projectsBuf);
        const project = projects.find(project => project.id === parseInt(projectId));
        if (!project) {
            console.log("Project does not exist");
        }
        return project;
    } catch (err) {
        console.error('Something went wrong while parsing data');
    }
}

module.exports = projectsRouter;