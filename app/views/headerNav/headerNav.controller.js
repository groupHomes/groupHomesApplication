app.controller('HeaderNavController', function($scope, $http, userService, $location) {


  $scope.user=userService.get();
  console.log($scope.user);

  $scope.isLoggedIn=function () {
    $scope.user=userService.get();
    // console.log($scope.user);
    // if ($scope.user === undefined) {
    //   console.log('sdfas')
    // }
  };



  $scope.currentPage=$location.path();

  $scope.isLoggedIn();
});
