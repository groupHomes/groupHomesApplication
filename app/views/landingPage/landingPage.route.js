app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('landingPage', {
    url: '/',
    views: {
      'pageContent': {
        templateUrl: 'views/landingPage/landingPage.html',
        controller: 'LandingPageController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
