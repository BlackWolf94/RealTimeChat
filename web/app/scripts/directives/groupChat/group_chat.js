'use strict';

/**
 * @ngdoc directive
 * @name chatApp.directive:groupChat
 * @description
 * # groupChat
 */
angular.module('chatApp')
    .directive('groupChat', function () {
        return {
            templateUrl: 'web/app/scripts/directives/groupChat/group_chat.html',
            restrict: 'E',
            controller: function($scope){
                var socket = $scope.getSocket();

                socket.on('group_messages', function(messages){
                    $scope.$apply( function () {
                        $scope.messages = messages;
                    })
                });

                socket.on('new_group_message', function(message){
                    $scope.$apply( function () {
                        $scope.messages.push(message);
                    });
                });

                $scope.createMessage = function(msg, sender, date){
                    return{
                        message: msg,
                        sender: sender || $scope.user._id,
                        date: date || new Date().valueOf(),
                    }
                };



                $scope.sendToGroupChat = function(){
                    socket.emit('group_message', $scope.createMessage($scope.msg));
                    $scope.msg = '';
                }

            }
        };
    });
