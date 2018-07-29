app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('listingCreate', {
    url: '/listingCreate',
    views: {
      'headerNav': {
        templateUrl: 'views/headerNav/headerNav.html',
        controller: 'HeaderNavController'
      },
      'pageContent': {
        templateUrl: 'views/listingCreate/listingCreate.html',
        controller: 'ListingCreateController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
