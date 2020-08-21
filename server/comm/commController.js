'use strict';

const Comm = require('./commModel');

module.exports.dohvatiKomentar = async (req, res, next) => {
  try {
    // Dohvatanje komentara po ID-ju
    const { commId } = req.params;
    const komentar = await Comm.findById(commId);
    if (!komentar) {
      res.status(404).json({error: 'Nepostojeci komentar'});
      return;
    }

    // Uspesno dohvatanje je 200 OK
    res.status(200).json(komentar);
  } catch (err) {
    next(err);
  }
};

module.exports.lajkujKomentar = async (req, res, next) => {
  try {
    // Dohvatanje korisnika koji lajkuje
    const userId = req.user.sub;

    // Dohvatanje trazenog komentara
    const { commId } = req.params;
    const komentar = await Comm.findById(commId);
    if (!komentar) {
      res.status(404).json({error: 'Nepostojeci komentar'});
      return;
    }

    // Azuriranje podataka o lajkovanju
    const novKomentar = komentar.likes.includes(userId) ?
    await Comm.findByIdAndUpdate(
      commId,
      { $pull: { likes: userId } },
      { new: true }
    ) :
    await Comm.findByIdAndUpdate(
      commId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    // Uspesni (dis)lajk je 200 OK
    res.status(200).json(novKomentar);
  } catch (err) {
    next(err);
  }
}

module.exports.obrisiKomentar = async (req, res, next) => {
  try {
    // Dohvatanje trazenog komentara
    const { commId } = req.params;
    const komentar = await Comm.findById(commId);
    if (!komentar) {
      res.status(404).json({error: 'Nepostojeci komentar'});
      return;
    }

    // Provera autora komentara, tudji
    // komentar je 401 UNAUTHORIZED
    const idKorisnika = req.user.sub;
    if (komentar.user != idKorisnika) {
      res.status(401).json({error: 'Nije autor komentara'});
      return;
    }

    // Transakciono brisanje komentara
    const session = mongoose.startSession();
    await session.withTransaction(async () => {
      await komentar.remove({ session });

      // Povecavanje brojaca komentara
      await Post.findByIdAndUpdate(
        komentar.post,
        { $inc: { comms: -1 } },
        { session }
      );

      // Uspesno brisanje je 200 OK
      res.status(200).json(komentar);
    });
    session.endSession();
  } catch (err) {
    next(err);
  }
};
