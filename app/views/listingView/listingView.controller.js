app.controller('ListingViewController', function($scope, dataService, CONSTANTS, $mdDialog, userService, facilityService) {
  console.log('listingView');

  // $scope.loadAll = function() {
  //   dataService.get('patientUpload', {'PATID' : '1'}).then(function(data) {
  //     $scope.files = data.data;
  //     console.log('files', $scope.files);
  //     angular.forEach($scope.files, function(file) {
  //       file.LINK = CONSTANTS.api.baseUrl + CONSTANTS.api.path + CONSTANTS.api.query + "getPatientUploadFile&KEYID=" + file.KEYID;
  //       console.log("link: " + file.LINK);
  //     });
  //   });
  // };
  // $scope.loadAll();

  // dataService.get('LTCFacilities').then(function (response) {
  //   console.log(response.data[0]);
  //   $scope.facility=response.data[0];
  // });
  //
  //get logged in user info
  $scope.user=userService.get();
  // console.log($scope.user);

  //get facility info
  $scope.facility=facilityService.get();
  console.log($scope.facility);


  // dataService.get('facility', {id: $scope.facility.id}).then(function (response) {
  //   console.log('facility', response.data[0]);
  //   $scope.userFacility=response.data[0];
  // });

  //get all photos for facility
  dataService.get('photo', {id: $scope.facility.id}).then(function (response) {
    console.log(response.data);
    $scope.facilityPhotos=response.data;
    // $scope.facilityPhotos.forEach(function (photo) {
    //   // console.log(photo.smallPhoto)
    //   var link = 'http://18.236.125.242/groupHomes/photos/' + $scope.facility.id + '/' + photo.smallPhoto;
    //   $scope.thumbnailArr.push(link);
    //   $scope.selectedFilesArr.push(link);
    // });
  });



  $scope.showAdvanced = function(ev) {
      $mdDialog.show({
        controller: 'ListingViewImagesController',
        templateUrl: './views/modals/listingViewImages/listingViewImages.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        locals: {
          facilityPhotos: $scope.facilityPhotos,
          facility: $scope.facility

          }

      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };
});
