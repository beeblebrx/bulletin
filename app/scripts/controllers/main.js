'use strict';

angular.module('bulletiiniApp')
    .controller('MainCtrl', function ($scope, $http) {
        $http.get('/api/bulletins/all').success(function(bulletins) {
            $scope.bulletins = bulletins;
        });
    });
