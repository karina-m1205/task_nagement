const express = require('express');

const usersRouter = express.Router();
const fs = require('fs');

usersRouter.post('/', (req, res) => {
  let newUser = req.body;

  fs.readFile('./users/users.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('File does not exist');
      return res.status(500).send('Internal server error');
    }
    let users = [];

    try {
      users = JSON.parse(data);
      const findUser = users.find(user => user.id === parseInt(newUser.id));
      if (findUser) {
        return res.status(400).send("user already exist");
      }
      users.push(newUser);

      fs.writeFile('./users/users.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error('Cannot add user');
          return res.status(500).send('Internal server error');
        }
        return res.status(201).send({ message: 'User created' });
      });
    } catch (err) {
      console.error('Something went wrong while parsing data');
    }
  });
});

usersRouter.get('/', (req, res) => {
  fs.readFile("./users/users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    try {
      users = JSON.parse(data);
      return res.status(200).send(users);
    } catch (err) {
      console.error('Something went wrong while parsing data');
    }
  })
});

usersRouter.get(`/:userId`, (req, res) => {
  fs.readFile("./users/users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    try {
      users = JSON.parse(data);
      const user = users.find(user => user.id === parseInt(req.params.userId));
      if (!user) {
        return res.status(400).send("User does not exist");
      }
      return res.status(200).send(user);
    } catch (err) {
      console.error('Something went wrong while parsing data');
    }
  })
});

usersRouter.put(`/:userId`, (req, res) => {
  fs.readFile("./users/users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    try {
      users = JSON.parse(data);
      const user = users.find(user => user.id === parseInt(req.params.userId));
      if (!user) {
        return res.status(400).send("User does not exist");
      }

      const { id, name, email, role } = { ...req.body };
      user.id = id;
      user.name = name;
      user.email = email;
      user.role = role;

      fs.writeFile("./users/users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error('Cannot add changes');
          return res.status(500).send('Internal server error');
        }
        return res.status(200).send(user);
      });
    } catch (err) {
      console.error('Something went wrong while parsing data');
    }
  })
});

usersRouter.delete(`/:userId`, (req, res) => {
  fs.readFile("./users/users.json", "utf-8", (err, data) => {
    if (err) {
      console.error("File does not exist");
      return res.status(500).send("Internal server error");
    }

    try {
      users = JSON.parse(data);
      const user = users.find(user => user.id === parseInt(req.params.userId));
      if (!user) {
        return res.status(400).send("User does not exist");
      }
      users.splice(users.indexOf(user), 1);

      fs.writeFile("./users/users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error('Cannot add changes');
          return res.status(500).send('Internal server error');
        }
      });

      return res.status(200).send({ message: "User deleted" });
    } catch (err) {
      console.error('Something went wrong while parsing data');
    }
  })
});

module.exports = usersRouter;
