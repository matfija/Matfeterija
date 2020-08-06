const express = require('express');
const cors = require('cors');
const monk = require('monk');

const app = express();

// Conect to the mongoDB on my local machine to a DB called meower.
// process.env.MONGO_URI ||
const db = monk('localhost:3000/matfeterija');
// If any of this doesn't exist, this will automatically create it.
const poruke = db.get('poruke');

// Solves the cors error.
app.use(cors());
// The server can't parse the request without this. Any incoming request
// that has a content type of application/json will be parsed with this.
app.use(express.json());

// When the client makes a request on the '/' route, ...
app.get('/', (request, response) => {
  response.json({
    message: 'Matfeterija!'
  });
});

app.get('/poruke', (req, res) => {
  // If we don't pass anything to find, that means find all of the things
  // in the database.
  poruke
    .find()
    .then(poruke => {
      console.log(poruke);
      res.json(poruke);
    });
});

function isValidPoruka(poruka) {
  return poruka.name && poruka.name.toString().trim() !== '' &&
      poruka.content && poruka.content.toString().trim() !== '';
}

app.post('/poruke', (req, res) => {
  if(isValidPoruka(req.body)) {
    // Creating the object.
    const poruka = {
      name: req.body.name.toString().trim(),
      content: req.body.content.toString().trim(),
      created: new Date()
    };

    // debug: Check if the object was created right.
    console.log(poruka);
    // Baza mora biti pokrenuta da bi ovo radilo, pokrece se sa
    // mongod --dbpath=<path do data foldera koji je u server folderu>
    // --port=3000
    poruke.insert(poruka).then(createdPoruka => {
          res.json(createdPoruka);
        }).catch(err => console.log(err));

  }
  else {
    // We want to protect against ppl submitting blank data.
    res.status(422);
    res.json({
      message: 'Morate uneti ime i poruku!'
    });
  }
});

// Now, when we have an app, we want to start listening to requests.
app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');
});
