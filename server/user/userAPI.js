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
router.get('/:alas', controller.dohvatiKorisnika);
router.post('/:alas', controller.zapratiKorisnika);

module.exports = router;
