'use strict';

const express = require('express');

// User je zasebna ruta
const router = express.Router();
const controller = require('./userController');

// Zahtevi na korenoj ruti
router.get('/', controller.dohvatiSveKorisnike);
router.patch('/', controller.azurirajSe)
router.delete('/', controller.obrisiSe);

// Parametrizovani zahtevi
router.get('/:userId', controller.dohvatiKorisnika);
router.post('/:userId', controller.zapratiKorisnika);

module.exports = router;
