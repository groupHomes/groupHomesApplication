app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('listingView', {
    url: '/listingView',
    views: {
      'headerNav': {
        templateUrl: 'views/headerNav/headerNav.html',
        controller: 'HeaderNavController'
      },
      'pageContent': {
        templateUrl: 'views/listingView/listingView.html',
        controller: 'ListingViewController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
