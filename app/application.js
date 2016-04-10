/* define our modules */
angular.module('qpx.services', ['ngCookies']);
angular.module('qpx.filters', []);
angular.module('qpx.directives', []);
angular.module('qpx.controllers', []);

/* load services */

/* load filters */

/* load directives */
require('./js/directives/capitalize.js');

/* load controllers */
require('./js/controllers/home.js');

window.Qpx = angular.module("Qpx", [
  'ui.router',
  'qpx.controllers',
  'qpx.directives',
  'qpx.filters',
  'qpx.services',
  'ngAnimate',
  'ngMaterial',
  'ngMessages',
  'md.data.table',
]);

Qpx.run(['$rootScope', '$state',
  function($rootScope, $state) {
    $rootScope._ = window._;
    $rootScope.moment = window.moment;
  }
]);

/* application routes */
Qpx.config(['$stateProvider','$locationProvider', '$mdThemingProvider', '$mdDateLocaleProvider',
  function($stateProvider, $locationProvider, $mdThemingProvider, $mdDateLocaleProvider) {
    $locationProvider.html5Mode(true);

    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50'],
      '50': 'ffffff'
    });

    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('ranger')
      .primaryPalette('customBlue', {
        'default': '500',
        'hue-1': '50'
      });
      

    $stateProvider
      .state('default', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      });
}]);
