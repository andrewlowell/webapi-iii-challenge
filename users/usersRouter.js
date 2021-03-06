const express = require('express');
const router = express.Router();
const db = require('./userDb.js');

router.get('/:id/posts', (req, res) => {
  db.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
})

router.get('/', (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({ error: "The users information could not be retrieved." })
    })
})

router.post('/', (req, res) => {
  const { name } = req.body
  if (!name) {
    res.status(400).json({ errorMessage: "Please provide name for the user." })
  }
  else {
    const user = {
      name: name
    }
    db.insert(user)
      .then(user => {
        db.getById(user.id)
          .then(foundUser => {
            res.status(201).json(foundUser)
          })
          .catch(err => {
            res.status(500).json({ error: 'created, but could not get the user??' })
          })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: "There was an error while saving the user to the database" })
      })
  }
})

router.get('/:id', (req, res) => {
  console.log('getting user', req.params.id)
  db.getById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
})

router.delete('/:id', (req, res) => {
  console.log(req.params.id)
  db.remove(req.params.id)
    .then(d => {
      if (d === 0) {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
      res.status(200).json({ message: "delete successful"})
    })
    .catch(err => {
      console.log(err)
      res.status(404).json({ error: "The user could not be removed" })
    })
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const { name } = req.body
  if (!name) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the user." })
  }
  else {
    db.getById(id)
      .then(user => {
        if (user.length === 0) {
          res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
        else {
          const userToUpdate = {
            name: name
          }
          db.update(id, userToUpdate)
            .then(num => {
              db.getById(id)
                .then(founduser => {
                  res.status(201).json(founduser)
                })
                .catch(err => {
                  res.status(500).json({ error: 'updated, but could not get the user??' })
                })
            })
            .catch(err => {
              res.status(500).json({ error: "The user information could not be modified." })
            })
          }
      })
      .catch(err => {
        res.status(500).json({ error: "The user information could not be modified." })
      })
  }
})

module.exports = router