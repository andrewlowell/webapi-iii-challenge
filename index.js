require('dotenv').config()

const express = require('express');
const posts = require('./posts/postsRouter.js');
const users = require('./users/usersRouter.js');

const correctName = (req, res, next) => {
  if ("name" in req.body) {
    const name = req.body.name;
    req.body.name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  next();
};

const app = express();
app.use(express.json());
app.use(correctName);
app.use('/posts', posts);
app.use('/users', users);
app.get('/', (req, res) => {
  res.send("Hello, Jake");
})

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
