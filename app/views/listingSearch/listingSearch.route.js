app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('listingSearch', {
    url: '/',
    views: {
      'headerNav': {
        templateUrl: 'views/headerNav/headerNav.html',
        controller: 'HeaderNavController'
      },
      'pageContent': {
        templateUrl: 'views/listingSearch/listingSearch.html',
        controller: 'ListingSearchController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
