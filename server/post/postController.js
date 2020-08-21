'use strict';

const mongoose = require('mongoose');

const Post = require('./postModel');
const Comm = require('../comm/commModel');

module.exports.dohvatiSveObjave = async (req, res, next) => {
  try {
    // Dohvatanje svih objava
    const objave = await Post.find()
      .populate('user').sort({ date: -1 });
    res.status(200).json(objave);
  } catch (err) {
    next(err);
  }
};

module.exports.dodajObjavu = async (req, res, next) => {
  try {
    // Dohvatanje autora objave
    const user = req.user.sub;

    // Dohvatanje naslova objave
    const { title } = req.body;
    if (!title) {
      res.status(400).json({error: 'Fali naslov'});
      return;
    }

    // Dohvatanje sadrzaja objave
    const { content } = req.body;
    if (!content) {
      res.status(400).json({error: 'Fali sadrzaj'});
      return;
    }

    // Dohvatanje tema objave
    const { topics } = req.body;

    // Pravljenje i cuvanje objave
    const objava = new Post({
      _id: new mongoose.Types.ObjectId,
      user, title, content, topics
    });
    await objava.save();

    // Uspesno objavljivanje je 200 OK
    res.status(200).json(objava);
  } catch (err) {
    next(err);
  }
};

module.exports.dohvatiObjavu = async (req, res, next) => {
  try {
    // Dohvatanje objave po ID-ju
    const { postId } = req.params;
    const objava = await Post.findById(postId)
      .populate('user').populate('likes');
    if (!objava) {
      res.status(404).json({error: 'Nepostojeca objava'});
      return;
    }

    // Dohvatanje svih komentara na njoj
    const komentari = await Comm.find({post: postId})
      .populate('user').populate('likes').sort({ date: 1 });

    // Uspesno dohvatanje je 200 OK
    res.status(200).json([objava, komentari]);
  } catch (err) {
    next(err);
  }
};

module.exports.dodajKomentar = async (req, res, next) => {
  try {
    // Dohvatanje autora objave
    const user = req.user.sub;

    // Dohvatanje identifikatora objave
    const post = req.params.postId;
    const objava = await Post.findById(post);
    if (!objava) {
      res.status(404).json({error: 'Nepostojeca objava'});
      return;
    }

    // Dohvatanje sadrzaja komentara
    const { content } = req.body;
    if (!content) {
      res.status(400).json({error: 'Fali sadrzaj'});
      return;
    }

    // Pravljenje i cuvanje komentara
    const komentar = new Comm({
      _id: new mongoose.Types.ObjectId,
      user, post, content
    });
    await komentar.save();

    res.status(200).json(komentar);
  } catch (err) {
    next(err);
  }
};

module.exports.lajkujObjavu = async (req, res, next) => {
  try {
    // Dohvatanje korisnika koji lajkuje
    const userId = req.user.sub;

    // Dohvatanje trazene objave
    const { postId } = req.params;
    const objava = await Post.findById(postId);
    if (!objava) {
      res.status(404).json({error: 'Nepostojeca objava'});
      return;
    }

    // Azuriranje podataka o lajkovanju
    const novaObjava = objava.likes.includes(userId) ?
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    ) :
    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    // Uspesni (dis)lajk je 200 OK
    res.status(200).json(novaObjava);
  } catch (err) {
    next(err);
  }
}

module.exports.obrisiObjavu = async (req, res, next) => {
  try {
    // Dohvatanje trazene objave
    const { postId } = req.params;
    const objava = await Post.findById(postId);
    if (!objava) {
      res.status(404).json({error: 'Nepostojeca objava'});
      return;
    }

    // Provera autora objave, tudja
    // objava je 401 UNAUTHORIZED
    const idKorisnika = req.user.sub;
    if (objava.user != idKorisnika) {
      res.status(401).json({error: 'Nije autor objave'});
      return;
    }

    // Brisanje objave
    const obrisana = await objava.remove();

    // Uspesno brisanje je 200 OK
    res.status(200).json(obrisana);
  } catch (err) {
    next(err);
  }
};
