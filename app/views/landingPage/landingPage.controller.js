app.controller('LandingPageController', function($scope, $state, dataService, searchService) {

  console.log('hello world');
  console.log( $scope.user)

  // $scope.noResults = false
  $scope.searchType = 'AGC'

  //search address
  $scope.submit = function (search) {
    console.log('search address: ',search);

    let searchObj = {
      address: search,
      type: $scope.searchType
    };

    dataService.search('facility',searchObj).then(function (response) {
      console.log(response.data);
      if (response.data.length !== 0 ) {
        searchService.set({searchText: search, searchResult: response.data, searchType: $scope.searchType});
        $state.go('listingSearch');
        $scope.noResults = false;
      } else {
        $scope.noResults = true;
      }
    });
  };


});
