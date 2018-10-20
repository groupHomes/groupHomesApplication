app.controller('LandingPageController', function($scope, $state, dataService, searchService) {

  //setting search by group home AGC to be true on page load
  $scope.searchGroupHomeAGC = true;

  //submit search
  $scope.submit = function (search) {
    let searchType;

    //setting searchType
    if ($scope.searchGroupHomeAGC) {
      searchType = "'AGC'"
      $scope.searchGroupHomeHIC = false;
    } else {
      searchType = "'HIC'"
      $scope.searchGroupHomeAGC = false;
    }

    //creating search obj to be passed to api
    let searchObj = {
      address: search,
      facilitytype: searchType,
      roomtype: "'Shared', 'Private'",
      gender: "'Female', 'Male'",
      minprice: 0,
      maxprice: 9999
    };

    //sending searchObj to api
    dataService.search('facility', searchObj).then(function (response) {
      if (response.data.length !== 0 ) {

        //creating searchFilterObj with defaults to true for all filters, except Medicaid and Group Homes
        let searchFilterObj = {
          searchText: search,
          searchGroupHomeHIC: $scope.searchGroupHomeHIC,
          searchGroupHomeAGC: $scope.searchGroupHomeAGC,
          searchGenderMale: true,
          searchGenderFemale: true,
          searchRoomTypePrivate: true,
          searchRoomTypeShared: true,
          searchMinPrice: 0,
          searchMaxPrice: 9999,
          searchMedicaid: false
        }

        //store search text, search results and searchFilterObj
        searchService.set({searchText: search, searchResult: response.data, searchFilterObj: searchFilterObj});
        $state.go('listingSearch');
        $scope.noResults = false;
      } else {
        $scope.noResults = true; //display msg for no results
      }
    });
  };
});
