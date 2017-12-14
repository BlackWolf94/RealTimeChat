'use strict';

/**
 * @ngdoc directive
 * @name chatApp.directive:mainContainer
 * @description
 * # mainContainer
 */
angular.module('chatApp')
    .directive('mainContainer', function () {
        return {
            templateUrl: 'web/app/scripts/directives/mainContainer/main_container.html',
            restrict: 'E',
            controller: function ($scope) {
                var socket = new Socket($scope.user);

                $scope.getSocket = function(){
                    return socket
                };


                // $scope.private_mssages = {};
                //
                // $scope.select_user = {};
                //
                // $scope.goToPerson = function (user) {
                //     $scope.select_user = user;
                // };
                //
                // $scope.addMsgToPrivateChat = function (user_id, msg) {
                //
                //     if ($scope.private_mssages[user_id])
                //         $scope.private_mssages[user_id] = [];
                //     $scope.private_mssages[user_id].push({
                //         msg: msg,
                //         time: new Date()
                //     })
                // };



            }
        };
    });
