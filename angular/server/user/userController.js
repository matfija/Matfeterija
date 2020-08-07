module.exports.prijava = async (req, res, next) => res.status(200).json({radnja: 'prijava'});

module.exports.registracija = async (req, res, next) => res.status(200).json({radnja: 'registracija'});

module.exports.potvrda = async (req, res, next) => res.status(200).json({radnja: 'potvrda'});

module.exports.brisanje = async (req, res, next) => res.status(200).json({radnja: 'brisanje'});

module.exports.dohvati = async (req, res, next) => res.status(200).json({radnja: 'dohvati'});

module.exports.zaprati = async (req, res, next) => res.status(200).json({radnja: 'zaprati'});
