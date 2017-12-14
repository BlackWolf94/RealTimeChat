'use strict';

/**
 * @ngdoc overview
 * @name chatApp
 * @description
 * # chatApp
 *
 * Main module of the application.
 */
angular
    .module('chatApp', [
        'ngMaterial',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngMdIcons'
    ])
    .config(function ($routeProvider, $locationProvider, $mdThemingProvider) {

        $locationProvider.hashPrefix('');
        // theme config
        var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });

        $mdThemingProvider.definePalette('customBlue', customBlueMap);

        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('pink');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey');

        $routeProvider
            .when('/', {
                templateUrl: 'web/app/views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: 'web/app/views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
