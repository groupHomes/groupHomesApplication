app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('listingEdit', {
    url: '/listingEdit',
    views: {
      'headerNav': {
        templateUrl: 'views/headerNav/headerNav.html',
        controller: 'HeaderNavController'
      },
      'pageContent': {
        templateUrl: 'views/listingEdit/listingEdit.html',
        controller: 'ListingEditController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
