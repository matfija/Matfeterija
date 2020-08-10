'use strict';

const express = require('express');

// Index je zasebna ruta
const router = express.Router();

// GET dohvata celokupan API
router.get('/', (req, res) => {
  const api = [
    { path: '/', children: [] }, // Dohvatanje API-ja
    { path: '/login', children: [
      { path: '/', method: 'POST', children: [] }, // Registracija
      { path: '/', method: 'PUT', children: [] }, // Prijava na tablu
      { path: '/', method: 'PATCH', children: [] }, // Potvrda (autentikacija)
    ] },
    { path: '/user', children: [
      { path: '/', method: 'GET', children: [] }, // Dohvatanje svih korisnika
      { path: '/', method: 'DELETE', children: [] }, // Brisanje svog naloga
      { path: '/', method: 'GET', parameters: ['userId'], children: [] }, // Dohvatanje korisnika
      { path: '/', method: 'POST', parameters: ['userId'], children: [] } // Pracenje korisnika
    ] },
    { path: '/post', children: [
      { path: '/', method: 'GET', children: [] }, // Dohvatanje svih objava
      { path: '/', method: 'POST', children: [] }, // Dodavanje nove objave
      { path: '/', method: 'GET', parameters: ['postId'], children: [] }, // Dohvatanje objave
      { path: '/', method: 'POST', parameters: ['postId'], children: [] }, // Dodavanje komentara
      { path: '/', method: 'DELETE', parameters: ['postId'], children: [] } // Brisanje objave
    ] },
    { path: '/comm', children: [
      { path: '/', method: 'GET', parameters: ['commId'], children: [] }, // Dohvatanje komentara
      { path: '/', method: 'DELETE', parameters: ['commId'], children: [] } // Brisanje komentara
    ] }
  ];
  res.status(200).json(api);
});

module.exports = router;
