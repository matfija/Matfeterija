const http = require('http');
const app = require('./app');

// Kreiranje servera i prosledjivanje Express.js aplikacije
// koja ce opsluzivati HTTP zahteve ka tom serveru
const server = http.createServer(app);

// Zapocinjanje osluskivanja HTTP zahteva na datom portu
const port = process.env.PORT || 3000;
server.listen(port);

// Potvrda da je server uspesno pokrenut
server.once('listening', () => {
  console.log(`Server osluskuje na http://localhost:${port}.`);
});
