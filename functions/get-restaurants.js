'use strict'

const co = require('co');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;
const restaurantTableName = process.env.restaurants_table;

function* getRestaurants(count){
    let req = {
        TableName : restaurantTableName,
        Limit : count
    };

    let res = yield dynamodb.scan(req).promise();
    return res.Items;
}

module.exports.handler = co.wrap(function* (event, context, callback){
    let restaurants = yield getRestaurants(defaultResults);
    let response = {
        statusCode : 200,
        body: JSON.stringify(restaurants)
    }

    callback(null, response);
});  