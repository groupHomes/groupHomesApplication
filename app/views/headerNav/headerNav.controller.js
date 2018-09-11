app.controller('HeaderNavController', function($scope, $http, userService, $location, $state) {


  $scope.user=userService.get();
  console.log($scope.user);

  // console.log(JSON.parse($scope.user));

  $scope.isLoggedIn=function () {
    $scope.user=userService.get();
    // console.log($scope.user);
    // if ($scope.user === undefined) {
    //   console.log('sdfas')
    // }
  };



  $scope.currentPage=$location.path();

  $scope.isLoggedIn();
  // console.log( searchService.get() )

  $scope.logout = function () {
    userService.logout();
    console.log('logging out')
    $state.go('landingPage')
  }

});
