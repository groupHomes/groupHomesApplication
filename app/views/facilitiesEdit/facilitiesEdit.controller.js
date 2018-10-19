app.controller('FacilitiesEditController', function($scope, dataService) {
  console.log('facilitiesEdit');

  function getFacilities() {
    var searchObj = {
      address: 'Las Vegas',
      facilitytype: "'AGC', 'HIC'",
      roomtype: "'Shared', 'Private'",
      gender: "'Female', 'Male'",
      price: 9999,
      medicaid: "Y"
    }

    dataService.search('facility', searchObj).then(function (response) {
      $scope.facilities = response.data;
      $scope.originalList = angular.copy($scope.facilities)
    })
  }

  $scope.submit = function (facility) {
    var facilityObj = {
      id: facility.id,
      specialHmFeature: facility.specialHmFeature
    }
    dataService.edit('facility', facilityObj).then(function (response) {
      console.log(response);
    });
  }


  $scope.reset = function(index) {
    $scope.facilities[index] = angular.copy($scope.originalList[index]);
  };

  getFacilities()

})
