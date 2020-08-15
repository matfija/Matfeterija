'use strict';

const express = require('express');

// Image je zasebna ruta
const router = express.Router();
const controller = require('./imageController');

// Parametrizovani zahtev
router.get('/:image', controller.dohvatiSliku);

module.exports = router;
