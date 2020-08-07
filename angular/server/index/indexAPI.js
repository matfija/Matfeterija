const express = require('express');

// Index je zasebna ruta
const router = express.Router();

// Dohvatanje REST API-ja
const getAPI = (req, res) => {
  const api = [
    { path: '/', children: [
      { path: '/', method: 'GET', children: [] }, // Dohvatanje API-ja
      { path: '/', method: 'OPTIONS', children: [] }, // Dohvatanje API-ja
    ] },
    { path: '/user', children: [
      { path: '/', method: 'GET', children: [] }, // Prijava
      { path: '/', method: 'POST', children: [] }, // Registracija
      { path: '/', method: 'PATCH', children: [] }, // Autentikacija
      { path: '/', method: 'DELETE', children: [] }, // Brisanje naloga
      { path: '/', method: 'GET', parameters: ['userId'], children: [] }, // Dohvatanje korisnika
      { path: '/', method: 'POST', parameters: ['userId'], children: [] } // Pracenje korisnika
    ] },
    { path: '/post', children: [
      { path: '/', method: 'GET', children: [] }, // Dohvatanje svih objava
      { path: '/', method: 'POST', children: [] }, // Dodavanje nove objave
      { path: '/', method: 'GET', parameters: ['postId'], children: [] }, // Dohvatanje objave
      { path: '/', method: 'POST', parameters: ['postId'], children: [] }, // Dodavanje komentara
      { path: '/', method: 'DELETE', parameters: ['postId'], children: [] }, // Brisanje objave
      { path: '/', method: 'DELETE', parameters: ['postId', 'commId'], children: [] } // Brisanje komentara
    ] }
  ];
  res.status(200).json(api);
}

// GET dohvata celokupan API
router.get('/', getAPI);

module.exports = router;
