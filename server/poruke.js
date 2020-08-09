const express = require('express');
const monk = require('monk');

// Poruke su zasebna ruta
const router = express.Router();

// Conect to the mongoDB on my local machine to a DB called meower.
// If any of this doesn't exist, this will automatically create it.
const db = monk('mongodb://localhost:27017/matfeterija');
const poruke = db.get('poruke');

router.get('/', (req, res) => {
  // If we don't pass anything to find, that means find all of the things
  // in the database.
  poruke
    .find()
    .then(poruke => {
      res.json(poruke);
    });
});

function isValidPoruka(poruka) {
  return poruka.name && poruka.name.toString().trim() !== '' &&
      poruka.content && poruka.content.toString().trim() !== '';
}

router.post('/', (req, res) => {
  if(isValidPoruka(req.body)) {
    // Creating the object.
    const poruka = {
      name: req.body.name.toString().trim(),
      content: req.body.content.toString().trim(),
      created: new Date()
    };

    // Baza mora biti pokrenuta da bi ovo radilo
    poruke.insert(poruka).then(createdPoruka => {
          res.json(createdPoruka);
        }).catch(err => console.err(err));

  }
  else {
    // We want to protect against ppl submitting blank data.
    res.status(422);
    res.json({
      message: 'Morate uneti ime i poruku!'
    });
  }
});

module.exports = router;
