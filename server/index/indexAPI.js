'use strict';

const express = require('express');

// Index je zasebna ruta
const router = express.Router();

// Alikativni programski interfejs servera
const api = [
  { path: '/', children: [], action: 'Дохватање API-ја' },
  { path: '/active', children: [
    { path: '/', method: 'GET', children: [], action: 'Дохватање активних корисника' },
    { path: '/', method: 'DELETE', children: [], action: 'Одјава са табле' }
  ] },
  { path: '/login', children: [
    { path: '/', method: 'POST', children: [], action: 'Регистрација' },
    { path: '/', method: 'PUT', children: [], action: 'Пријава на таблу' },
    { path: '/', method: 'PATCH', children: [], action: 'Потврда (аутентификација)' }
  ] },
  { path: '/user', children: [
    { path: '/', method: 'GET', children: [], action: 'Дохватање свих корисника' },
    { path: '/', method: 'PATCH', children: [], action: 'Ажурирање свог налога' },
    { path: '/', method: 'DELETE', children: [], action: 'Брисање свог налога' },
    { path: '/', method: 'GET', parameters: ['userId'], children: [], action: 'Дохватање корисника' },
    { path: '/', method: 'POST', parameters: ['userId'], children: [], action: 'Праћење корисника' }
  ] },
  { path: '/post', children: [
    { path: '/', method: 'GET', children: [], action: 'Дохватање свих објава' },
    { path: '/', method: 'POST', children: [], action: 'Додавање нове објаве' },
    { path: '/', method: 'GET', parameters: ['postId'], children: [], action: 'Дохватање објаве' },
    { path: '/', method: 'POST', parameters: ['postId'], children: [], action: 'Додавање коментара' },
    { path: '/', method: 'DELETE', parameters: ['postId'], children: [], action: 'Брисање објаве' }
  ] },
  { path: '/comm', children: [
    { path: '/', method: 'GET', parameters: ['commId'], children: [], action: 'Дохватање коментара' },
    { path: '/', method: 'DELETE', parameters: ['commId'], children: [], action: 'Брисање коментара' }
  ] }
];

// GET dohvata celokupan API
router.get('/', (req, res) => {
  res.render('indexPage', { api });
});

module.exports = router;
