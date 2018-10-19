app.controller('FacilitiesEditController', function($scope, dataService) {
  console.log('facilitiesEdit');

  function getFacilities() {
    dataService.get('facilitiesAdmin').then(function (response) {
      console.log(response)
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
