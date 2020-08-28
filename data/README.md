### Matfeterija

## RSA ključevi
Datoteke private.key i public.key pohranjuju privatni i javni ključ, koji su neophodni za RS256 enkripciju JWT žetona koje server koristi za autentikaciju korisnika. Ne moraju biti baš ovi priloženi, već bilo koji validan par.

## ProtonMail
Datoteka proton.json sadrži kredencijale ProtonMail-a, kao JSON objekat sa poljima username i password. Nije pohranjena na repozitorijumu iz očiglednih sigurnosnih razloga, pa je neophodno ručno je napraviti, te po potrebi otvoriti nalog na ProtonMail-u kako bi sve radilo. Nažalost, Alas blokira Ethereum mail (nodemailer), koji je moguće koristiti i bez naloga, tako da je moralo ovako.
