### Matfeterija

## Izvoz baze
Datoteke users.json, posts.json i comms.json pohranjuju podatke o korisnicima, objavama i komentarima iz baze podataka. Izvezeni su skriptom export.sh, a mogu se uvesti pomoću import.sh. Ovi podaci služe za demonstraciju rada projekta. Lozinka svakog korisnika je jednaka: 11111111 (osam jedinica).

## RSA ključevi
Datoteke private.key i public.key pohranjuju privatni i javni ključ, koji su neophodni za RS256 enkripciju JWT žetona koje server koristi za autentikaciju korisnika. Ne moraju biti baš ovi priloženi, već bilo koji validan par.

## ProtonMail
Datoteka proton.json sadrži kredencijale ProtonMail-a, kao JSON objekat sa poljima username i password. Nije pohranjena na repozitorijum iz očiglednih sigurnosnih razloga, pa je neophodno ručno je napraviti, te po potrebi otvoriti nalog na ProtonMail-u kako bi sve radilo. Nažalost, Alas blokira Ethereum mail (nodemailer), koji je moguće koristiti i bez naloga, tako da je moralo ovako.
