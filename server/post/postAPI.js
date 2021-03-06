'use strict';

const express = require('express');

// Post je zasebna ruta
const router = express.Router();
const controller = require('./postController');

// Zahtevi na korenoj ruti
router.get('/', controller.dohvatiSveObjave);
router.post('/', controller.dodajObjavu);

// Parametrizovani zahtevi
router.get('/:postId', controller.dohvatiObjavu);
router.post('/:postId', controller.dodajKomentar);
router.patch('/:postId', controller.lajkujObjavu);
router.delete('/:postId', controller.obrisiObjavu);

module.exports = router;
