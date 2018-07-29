app.controller('HeaderNavController', function($scope, $http, userService) {


  $scope.user=userService.get();
  console.log($scope.user)

  $scope.isLoggedIn=function () {
    $scope.user=userService.get();
    // console.log($scope.user);
    // if ($scope.user === undefined) {
    //   console.log('sdfas')
    // }
  };




  $scope.isLoggedIn();
});
