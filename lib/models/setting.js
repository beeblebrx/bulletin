'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Application Settings Schema
 */
var SettingsSchema = new Schema({
    _id: { type: Number },
    idHashSalt: { type: String, required: true }
});

/**
 * Validations
 */
SettingsSchema.path('idHashSalt').validate(function (salt) {
    return salt !== '';
}, 'Salt may not be empty');

mongoose.model('Settings', SettingsSchema);
