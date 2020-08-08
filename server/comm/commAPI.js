const express = require('express');

// Comm je zasebna ruta
const router = express.Router();
const controller = require('./commController');

// Parametrizovani zahtevi
router.get('/:commId', controller.dohvatiKomentar);
router.delete('/:commId', controller.obrisiKomentar);

module.exports = router;
