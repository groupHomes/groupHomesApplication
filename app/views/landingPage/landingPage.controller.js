app.controller('LandingPageController', function($scope, $state, dataService, searchService) {

  console.log('hello world');
  console.log('user:', $scope.user)

  // $scope.noResults = false
  $scope.searchGroupHomeAGC = true;

  //search address
  $scope.submit = function (search) {
    console.log('search address: ',search);

    var searchType;

    if ($scope.searchGroupHomeAGC) {
      searchType = "'AGC'"
      $scope.searchGroupHomeHIC = false;
    } else {
      searchType = "'HIC'"
      $scope.searchGroupHomeAGC = false;
    }

    let searchObj = {
      address: search,
      // type: searchType
      facilitytype: searchType,
      roomtype: "'Shared', 'Private'",
      gender: "'Female', 'Male'",
      price: 9999
    };

    console.log('search Obj to be passed to api', searchObj)

    dataService.search('facility', searchObj).then(function (response) {
      console.log(response.data);
      if (response.data.length !== 0 ) {

        let searchFilterObj = {
          searchText: search,
          searchGroupHomeHIC: $scope.searchGroupHomeHIC,
          searchGroupHomeAGC: $scope.searchGroupHomeAGC,
          searchGenderMale: true,
          searchGenderFemale: true,
          searchRoomTypePrivate: true,
          searchRoomTypeShared: true,
          searchPrice: 'Any Price'
        }

        searchService.set({searchText: search, searchResult: response.data, searchFilterObj: searchFilterObj});
        $state.go('listingSearch');
        $scope.noResults = false;
      } else {
        $scope.noResults = true;
      }
    });
  };


});
