const express = require('express');
const router = express.Router();
const db = require('./postDb.js');

router.get('/', (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.post('/', (req, res) => {
  const { text } = req.body
  if (!text) {
    res.status(400).json({ errorMessage: "Please provide text for the post." })
  }
  else {
    const post = {
      text: text,
      user_id: 1
    }
    db.insert(post)
      .then(post => {
        db.getById(post.id)
          .then(foundPost => {
            res.status(201).json(foundPost)
          })
          .catch(err => {
            res.status(500).json({ error: 'created, but could not get the post??' })
          })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: "There was an error while saving the post to the database" })
      })
  }
})

router.get('/:id', (req, res) => {
  console.log('getting post', req.params.id)
  db.getById(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
})

router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
    .then(d => {
      console.log(d);
      if (d === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
      res.status(200).json({ message: "delete successful"})
    })
    .catch(err => {
      console.log(err)
      res.status(404).json({ error: "The post could not be removed" })
    })
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const { text } = req.body
  if (!text) {
    res.status(400).json({ errorMessage: "Please provide text for the post." })
  }
  else {
    db.getById(id)
      .then(post => {
        if (post.length === 0) {
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
        else {
          const postToUpdate = {
            text: text
          }
          db.update(id, postToUpdate)
            .then(num => {
              db.getById(id)
                .then(foundPost => {
                  res.status(201).json(foundPost)
                })
                .catch(err => {
                  res.status(500).json({ error: 'updated, but could not get the post??' })
                })
            })
            .catch(err => {
              res.status(500).json({ error: "The post information could not be modified." })
            })
          }
      })
      .catch(err => {
        res.status(500).json({ error: "The post information could not be modified." })
      })
  }
})

module.exports = router