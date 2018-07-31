app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('listingPreferred', {
    url: '/listingPreferred',
    views: {
      'headerNav': {
        templateUrl: 'views/headerNav/headerNav.html',
        controller: 'HeaderNavController'
      },
      'pageContent': {
        templateUrl: 'views/listingPreferred/listingPreferred.html',
        controller: 'ListingPreferredController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
