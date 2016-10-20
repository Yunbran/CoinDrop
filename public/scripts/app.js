;(function(){
  'use strict';
  angular.module('coindropApp', [
    'ngAnimate',
    'ui.bootstrap',
    // 'ngCookies',
    // 'ng-Table',
    'ui.router'
    // 'ngSanitize',
    // 'ngTouch'
  ])
  .service('$storage', Storage)
  /* @inject */
  .config(['$urlRouterProvider', '$stateProvider','$httpProvider', configuration])
  /* @inject */
  .factory('authInterceptor', authInterceptor).run(function() {
  /* @inject */
  });
  
  function configuration($urlRouterProvider, $stateProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('authInterceptor');
  }

  function Storage() {
    this.get = function(key) {
      return localStorage.getItem(key);
    };
    this.getObject = function(key) {
      return JSON.parse(localStorage.getItem(key));
    };
    this.set = function(key, val) {
      localStorage.setItem(key, val);
    };
    this.setObject = function(key, val) {
      var store = JSON.stringify(val);
      localStorage.setItem(key, store);
    };
    this.remove = function() {
      localStorage.clear();
    };
  }

  function authInterceptor($rootScope, $q, $storage, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($storage.get('token')) {
          config.headers.Authorization = $storage.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $storage.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }
}).call(this);