app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('signUp', {
    url: '/signUp',
    views: {
      // 'headerNav': {
      //   templateUrl: 'views/headerNav/headerNav.html',
      //   controller: 'HeaderNavController'
      // },
      'pageContent': {
        templateUrl: 'views/signUp/signUp.html',
        controller: 'SignUpController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
