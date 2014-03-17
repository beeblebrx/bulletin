'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Bulletin Schema
 */
var BulletinSchema = new Schema({
    title: String,
    text: String
});

/**
 * Validations
 */
BulletinSchema.path('text').validate(function (text) {
    return text !== '' && text !== null;
}, 'Text must not be empty');

mongoose.model('Bulletin', BulletinSchema);
