'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var ThingSchema = new Schema({
    name: String,
    info: String
});

/**
 * Validations
 */
ThingSchema.path('info').validate(function (info) {
    return info !== '' && info !== null;
}, 'Info must not be empty');

mongoose.model('Thing', ThingSchema);
