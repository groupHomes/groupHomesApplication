app.controller('LoginController', function($scope, $state, dataService, userService, facilityService) {

  console.log('hello world');
  $scope.signup=function () {
    $state.go('signUp')
  }

  $scope.login=function () {
    var loginInfo = {
      userName: $scope.email,
      password: $scope.password
    };


    dataService.get('user', loginInfo).then(function (response) {
      console.log(response);
      if (response.data.length < 1) {
        alert("Error: Password or Email incorrect");
      } else if (response.data[0].role === 'customer') {
        userService.set(response.data[0]);
        $state.go('listingSearch');
      } else if (response.data[0].role === 'client') {
        $scope.user = response.data[0];
        userService.set($scope.user);
        dataService.get('facility', {id: $scope.user.facilityId}).then(function (response) {
          console.log('facility', response.data[0]);
          $scope.facility = response.data[0];
          facilityService.set($scope.facility);
          if ($scope.facility.roomCount > 0) {
            $state.go('listingEdit');
          } else {
            $state.go('listingCreate');
          }
        });
      }
        //set student id
      //   var studentInfo = {
      //     KEYID: response.data[0].KEYID,
      //     studentid: response.data[0].studentid
      //   }
      //   studentService.set(studentInfo);
      //   $state.go('studentList');
      // } else if (response.data[0].role==="admin") {
      //   adminService.set(response.data[0].userid);
      //   $state.go('studentListAdmin');
      // } else if (response.data[0].role==="teacher") {
      //   teacherService.set(response.data[0].userid);
      //   $state.go('classList');
      // }
    });
  };

});
