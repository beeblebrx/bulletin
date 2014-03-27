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

BulletinSchema.path('text').validate(function (text) {
    return text !== null && text.length <= 2000;
}, 'Text is too long (max 2000 chars)');

BulletinSchema.path('title').validate(function (title) {
    return title !== '' && title !== null;
}, 'Title must not be empty');

BulletinSchema.path('title').validate(function (title) {
    return title !== null && title !== undefined && title.length <= 100;
}, 'Too long title (max 100 chars)');

mongoose.model('Bulletin', BulletinSchema);
