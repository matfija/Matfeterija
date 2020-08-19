'use strict';

const express = require('express');

// Index je zasebna ruta
const router = express.Router();

// Alikativni programski interfejs servera
const api = [
  { path: '/', children: [
    { method: 'GET', action: 'Дохватање API-ја'}
  ] },
  { path: '/active', children: [
    { method: 'GET', action: 'Дохватање активних корисника' },
    { method: 'DELETE', action: 'Одјава са табле' }
  ] },
  { path: '/login', children: [
    { method: 'POST', action: 'Регистрација' },
    { method: 'PUT', action: 'Пријава на таблу' },
    { method: 'PATCH', action: 'Потврда (аутентификација)' }
  ] },
  { path: '/images', children: [
    { method: 'GET', parameters: ['image'], action: 'Дохватање слике' }
  ] },
  { path: '/user', children: [
    { method: 'GET', action: 'Дохватање свих корисника' },
    { method: 'PATCH', action: 'Ажурирање свог налога' },
    { method: 'DELETE', action: 'Брисање свог налога' },
    { method: 'GET', parameters: ['alas'], action: 'Дохватање корисника' },
    { method: 'POST', parameters: ['alas'], action: 'Праћење корисника' }
  ] },
  { path: '/post', children: [
    { method: 'GET', action: 'Дохватање свих објава' },
    { method: 'POST', action: 'Додавање нове објаве' },
    { method: 'GET', parameters: ['postId'], action: 'Дохватање објаве' },
    { method: 'POST', parameters: ['postId'], action: 'Додавање коментара' },
    { method: 'DELETE', parameters: ['postId'], action: 'Брисање објаве' }
  ] },
  { path: '/comm', children: [
    { method: 'GET', parameters: ['commId'], action: 'Дохватање коментара' },
    { method: 'DELETE', parameters: ['commId'], action: 'Брисање коментара' }
  ] }
];

// GET dohvata celokupan API
router.get('/', (req, res) => {
  res.render('indexPage', { api });
});

module.exports = router;
