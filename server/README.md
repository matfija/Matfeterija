# Matfeterija 👋
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](#)

> Server za Matf message board

## Podešavanje

```sh
npm install
npm install nodemon -g
npm install run-rs -g
```

## Pokretanje

```sh
[sudo] [npx] run-rs --host localhost
[npx] nodemon server.js
```

## Napomena

Baza je replicirana, tako da je nije moguće automatski kreirati, oslanjajući se na MongoDB demon, koji podrazumevano radi na localhost-u i portu 21017. Umesto toga, neophodno je pomoću alata run-rs (ili nekako drukčije) napraviti distribuirani sistem sa tri kopije – sve na localhost-u, i to na portovima 21017, 21018, 21019. Ovo se lako radi komandom poput `run-rs --host localhost` na Windowsu ili `sudo npx run-rs` na Ubuntuu. Jedino treba imati u vidu da je neophodno ugasiti prethodno pomenuti podrazumevani demon, zbog konflikta na portu 21017. Ovaj problem ne postoji ukoliko prethodno nije instaliran MongoDB Server, jer u tom slučaju demonskog procesa ni nema, pošto run-rs automatski instalira svoju verziju.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
