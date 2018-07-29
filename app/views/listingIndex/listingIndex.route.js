app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('listingIndex', {
    url: '/listingIndex',
    views: {
      'headerNav': {
        templateUrl: 'views/headerNav/headerNav.html',
        controller: 'HeaderNavController'
      },
      'pageContent': {
        templateUrl: 'views/listingIndex/listingIndex.html',
        controller: 'ListingIndexController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
