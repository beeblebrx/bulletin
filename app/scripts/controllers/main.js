'use strict';

angular.module('bulletiiniApp')
    .controller('MainCtrl', function ($scope, $http) {
        $http.get('/api/bulletins/').success(function(bulletins) {
            $scope.bulletins = bulletins;
        });
    });
