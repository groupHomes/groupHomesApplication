app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('listingPreview', {
    url: '/listingPreview',
    views: {
      'headerNav': {
        templateUrl: 'views/headerNav/headerNav.html',
        controller: 'HeaderNavController'
      },
      'pageContent': {
        templateUrl: 'views/listingPreview/listingPreview.html',
        controller: 'ListingPreviewController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
