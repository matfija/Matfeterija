const express = require('express');

// User je zasebna ruta
const router = express.Router();
const controller = require('./userController');

// Zahtevi na korenoj ruti
router.get('/', controller.dohvatiSve);
router.delete('/', controller.obrisi);

// Parametrizovani zahtevi
router.get('/:userId', controller.dohvati);
router.post('/:userId', controller.zaprati);

module.exports = router;
