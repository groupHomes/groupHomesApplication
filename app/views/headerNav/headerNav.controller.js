app.controller('HeaderNavController', function($scope, $http, userService, $location, $state) {

  function isUserLoggedIn() {
    $scope.user=userService.get();
    console.log('user:', $scope.user)
  };

  $scope.currentPage=$location.path();

  $scope.logout = function () {
    userService.logout();
    $state.go('landingPage')
  }

  isUserLoggedIn();
});
