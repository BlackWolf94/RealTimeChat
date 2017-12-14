'use strict';

/**
 * @ngdoc service
 * @name chatApp.aut
 * @description
 * # dataBase/agent
 * Factory in the chatApp.
 */
angular.module('chatApp')
    .factory('aut', ['$http', '$window', '$rootScope', '$q',
        function ($http, $window, $rootScope, $q) {

            return {
                logIn: function (data) {
                    var deferred = $q.defer();

                    $http.post('/login', data)
                        .then( function (res) {
                            if(res.data.error){
                                deferred.reject(res.data.error)
                            }else{
                                $window.localStorage.setItem('user',JSON.stringify(res.data));
                                $rootScope.user = res.data;
                                deferred.resolve(res.data);
                            }
                        })
                        .catch(function(error){
                            console.error(error);
                            deferred.reject('Внутрішня помилка серверу')
                        });

                    return deferred.promise

                },
                register: function (data) {
                    var deferred = $q.defer();

                    $http.post('/register', data)
                        .then( function (res) {
                            if(res.data.error){
                                deferred.reject(res.data.error)
                            }else{
                                $window.localStorage.setItem('user',JSON.stringify(res.data));
                                $rootScope.user = res.data;
                                deferred.resolve(res.data);
                            }
                        })
                        .catch(function(error){
                            console.error(error);
                            deferred.reject('Внутрішня помилка серверу')
                        });

                    return deferred.promise
                },
                
                logOut: function () {
                    
                }
            }

        }]);