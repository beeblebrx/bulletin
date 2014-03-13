'use strict';

angular.module('bulletiiniApp')
    .factory('Session', function ($resource) {
        return $resource('/api/session/');
    });
