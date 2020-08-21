'use strict';

const express = require('express');

// Comm je zasebna ruta
const router = express.Router();
const controller = require('./commController');

// Parametrizovani zahtevi
router.get('/:commId', controller.dohvatiKomentar);
router.patch('/:commId', controller.lajkujKomentar);
router.delete('/:commId', controller.obrisiKomentar);

module.exports = router;
