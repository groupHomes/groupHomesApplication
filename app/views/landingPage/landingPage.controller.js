app.controller('LandingPageController', function($scope, $state, dataService, searchService) {

  console.log('hello world');
  console.log( $scope.user)

  // $scope.noResults = false
  //search address
  $scope.submit = function (search) {
    console.log('search address: ',search);

    dataService.search('facility', {address:search}).then(function (response) {
      console.log(response.data);
      if (response.data.length !== 0 ) {
        searchService.set({searchText: search, searchResult: response.data});
        $state.go('listingSearch');
        $scope.noResults = false;
      } else {
        $scope.noResults = true;
      }
    });
  };

});
