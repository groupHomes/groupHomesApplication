app.controller('LoginController', function($scope, $state, dataService, userService, facilityService) {

  $scope.signup=function () {
    $state.go('signup')
  }

  $scope.login=function () {
    var loginInfo = {
      userName: $scope.email,
      password: $scope.password
    };

    dataService.get('user', loginInfo).then(function (response) {
      if (response.data.length < 1) {
        alert("Error: Password or Email incorrect");
      } else if ( response.data[0].role === 'user') { //if user is has role 'user'
        userService.set(response.data[0]);
        $state.go('listingSearch');
      } else if (response.data[0].role === 'client') { //if user has role 'client'
        $scope.user = response.data[0];
        userService.set($scope.user);
        dataService.get('facility', {id: $scope.user.facilityId}).then(function (response) { //get client facility info and store in service
          $scope.facility = response.data[0];
          facilityService.set($scope.facility);
          if ($scope.facility.roomCount > 0) {
            $state.go('listingEdit');
          } else {
            $state.go('listingCreate');
          }
        });
      } else if (response.data[0].role === 'admin') {
        userService.set(response.data[0]);
        $state.go('facilitiesEdit')
      }
    });
  };
});
