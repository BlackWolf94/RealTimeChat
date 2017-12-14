'use strict';

/**
 * @ngdoc directive
 * @name chatApp.directive:privateChat
 * @description
 * # privateChat
 */
angular.module('chatApp')
    .directive('privateChat', function () {
        return {
            templateUrl: 'web/app/scripts/directives/privateChat/private_chat.html',
            restrict: 'E',
            controller: function ($scope) {
                var socket = $scope.getSocket();

                $scope.goToPerson = function (receiver) {
                    $scope.receiver = receiver;
                    console.log($scope.user._id + $scope.receiver._id)

                };

                $scope.sendPrivateMsg = function(){
                    if(!$scope.receiver)
                        return;

                    socket.emit('private_msg', {
                        message: $scope.receiver_msg,
                        sender_id: $scope.user._id,
                        receiver_id: $scope.receiver._id,
                        date: new Date().valueOf()
                    });
                    $scope.receiver_msg = '';
                };

                $scope.private_mssages = {};

                socket.on('new_private_msg', function (msg) {
                    $scope.$apply(function () {
                        var key = msg.sender_id;

                        if(msg.sender_id === $scope.user._id){
                            key = msg.receiver_id
                        }

                        if(!$scope.private_mssages[key])
                            $scope.private_mssages[key] = [];

                        $scope.private_mssages[key].push(msg);

                    });
                });

                socket.on('private_messages', function(messages){
                    $scope.$apply(function () {
                        $scope.private_mssages = messages;
                    });
                });
            }
        };
    });
