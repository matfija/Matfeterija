const express = require('express');

// User je zasebna ruta
const router = express.Router();
const controller = require('./userController');

// Zahtevi na korenoj ruti
router.get('/', controller.prijava);
router.post('/', controller.registracija);
router.patch('/', controller.potvrda);
router.delete('/', controller.brisanje);

// Parametrizovani zahtevi
router.get('/:userId', controller.dohvati);
router.post('/:userId', controller.zaprati);

module.exports = router;
