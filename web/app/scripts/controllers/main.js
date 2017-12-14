'use strict';

/**
 * @ngdoc function
 * @name chatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chatApp
 */
angular.module('chatApp')
    .controller('MainCtrl', function ($scope, $window, $rootScope, aut) {
        var main_content = document.getElementById('main-content');


        function resizeMainContent() {
            angular.element(main_content).css('height', $window.innerHeight + 'px');
        }

        resizeMainContent();

        angular.element($window).on('resize', resizeMainContent)

        $rootScope.user = JSON.parse($window.localStorage.getItem('user'));

        $rootScope.$watch('user', function () {
            if($rootScope.user)
                $scope.is_login = true;
            else
                $scope.is_login = false;
        }, true);

        $scope.logOut = function () {
            $rootScope.user = null;
            $window.localStorage.removeItem('user');
        }

    });
