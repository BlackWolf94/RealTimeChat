'use strict';

/**
 * @ngdoc directive
 * @name chatApp.directive:directiveAuthorization
 * @description
 * # directiveAuthorization
 */
angular.module('chatApp')
    .directive('directiveAuthorization', function () {
        return {
            templateUrl: 'web/app/scripts/directives/authorization/authorization.html',
            restrict: 'E',
            controller: function ($scope, aut) {
                $scope.is_registr = false;

                $scope.switchForm = function () {
                    $scope.is_registr = !$scope.is_registr;
                };

                $scope.registration = function () {
                    $scope.errorMsg = '';
                    var user = angular.extend({}, $scope.user);
                    user.password = JSON.stringify(CryptoJS.HmacSHA1(user.password,'secret'));
                    aut.register(user)
                        .catch(function (errorMsg) {
                            $scope.errorMsg = errorMsg;
                        })
                };

                $scope.logIn = function () {
                    $scope.errorMsg = '';
                    var user = angular.extend({}, $scope.user);
                    user.password = JSON.stringify(CryptoJS.HmacSHA1(user.password,'secret'));
                    aut.logIn(user)
                        .catch(function (errorMsg) {
                            $scope.errorMsg = errorMsg;
                        })
                };



            }

        };
    });
