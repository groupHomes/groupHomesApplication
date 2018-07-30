app.controller('SignUpController', function($scope, $rootScope, $state, dataService, userService, facilityService) {

  $scope.login = function () {
    $state.go('login');
  };

  $scope.signup=function () {
    var signinfo = {
      userid: $scope.email,
      password: $scope.password,
      role: $scope.role
    };

    dataService.add('user', signinfo).then(function (response) {
      console.log(response);
      if (response.data.status === 'success') {
        userService.set(signinfo);
        $state.go('listingSearch')
        // $rootScope.$on('$locationChangeStart', function (event, current, previous) {
        //   console.log("Previous URL: " + previous);
        // }
      }
    });
  };

});
