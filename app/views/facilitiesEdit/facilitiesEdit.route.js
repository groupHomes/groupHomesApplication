app.config(function($stateProvider, $locationProvider) {
  $stateProvider.state('facilitiesEdit', {
    url: '/facilitiesEdit',
    views: {
      'headerNav': {
        templateUrl: 'views/headerNav/headerNav.html',
        controller: 'HeaderNavController'
      },
      'pageContent': {
        templateUrl: 'views/facilitiesEdit/facilitiesEdit.html',
        controller: 'FacilitiesEditController'
      }
    }
  });

  $locationProvider.hashPrefix('');
});
