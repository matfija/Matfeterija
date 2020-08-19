'use strict';

const path = require('path');

module.exports.dohvatiSliku = async (req, res, next) => {
  try {
    // Resavanje putanje trazene slike
    const { image } = req.params;
    const putanja = path.resolve(__dirname, '..', 'images', image);

    // Slanje datoteke
    res.sendFile(putanja);
  } catch (err) {
    next(err);
  }
}
