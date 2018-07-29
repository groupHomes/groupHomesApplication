app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('login', {
    url: '/login',
    views: {
      // 'headerNav': {
      //   templateUrl: 'views/headerNav/headerNav.html',
      //   controller: 'HeaderNavController'
      // },
      'pageContent': {
        templateUrl: 'views/login/login.html',
        controller: 'LoginController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
