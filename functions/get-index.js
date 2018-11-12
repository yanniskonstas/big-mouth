'use strict';

const co      = require('co');
const Promise = require('bluebird');
const fs      = Promise.promisifyAll(require("fs"));
const Mustache = require('mustache');
const http = require('superagent-promise')(require('superagent'), Promise);
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const restaurantApiRoot = process.env.restaurant_api;

var html;

function* loadHtml () {
  if (!html) {
    console.log('loading index.html...');
    html = fs.readFileAsync('static/index.html', 'utf-8');
    console.log('loaded');
  }
  
  return html;
}

function* getRestaurants() {
  return (yield http.get(restaurantApiRoot)).body;
}

module.exports.handler = co.wrap(function* (event, context, callback) {
  let template = yield loadHtml();
  let restaurants = yield getRestaurants();
  let dayOfWeek = days[ new Date().getDay()];
  let html = Mustache.render(template, {dayOfWeek, restaurants});

  let response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    },
    body: html
  };

  callback(null, response);
});