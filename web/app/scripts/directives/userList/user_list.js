'use strict';

/**
 * @ngdoc directive
 * @name chatApp.directive:userList
 * @description
 * # userList
 */
angular.module('chatApp')
    .directive('userList', function () {
        return {
            templateUrl: 'web/app/scripts/directives/userList/user_list.html',
            restrict: 'E',
            controller: function ($scope) {
                var socket = $scope.getSocket();

                socket.on('user_online', function (users) {
                    delete users[$scope.user._id];
                    $scope.$apply( function () {
                        $scope.users = users;
                    })
                });

            }
        };
    });
