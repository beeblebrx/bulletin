'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MAXIMUM_TITLE_LENGTH = 100;
var MAXIMUM_TEXT_LENGTH = 2000;

/**
 * Bulletin Schema
 */
var BulletinSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true }
});

/**
 * Validations
 */
BulletinSchema.path('text').validate(function (text) {
    return text !== '';
}, 'Text must not be empty');

BulletinSchema.path('text').validate(function (text) {
    return text !== null && text !== undefined && text.length <= MAXIMUM_TEXT_LENGTH;
}, 'Text is too long (max ' + MAXIMUM_TEXT_LENGTH + ' chars)');

BulletinSchema.path('title').validate(function (title) {
    return title !== '';
}, 'Title must not be empty');

BulletinSchema.path('title').validate(function (title) {
    return title !== null && title !== undefined && title.length <= MAXIMUM_TITLE_LENGTH;
}, 'Too long title (max ' + MAXIMUM_TITLE_LENGTH + ' chars)');

mongoose.model('Bulletin', BulletinSchema);
