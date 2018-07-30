app.controller('ListingPreviewController', function($scope, dataService, CONSTANTS, $mdDialog, userService, facilityService, $state) {
  console.log('listingPreview');

  $scope.user=userService.get();
  console.log($scope.user);

  $scope.userFacilityId=userService.get().facilityId;


  //get user facility info
  dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
    console.log('facility', response.data[0]);
    $scope.facility=response.data[0];
  });

  //get facility rooms info
  dataService.get('facilityRooms', {id: $scope.userFacilityId}).then(function (response) {
    console.log(response.data);
    $scope.rooms = response.data;
  });

  //get facility primary photo
  // dataService.get('photo',{id: $scope.userFacilityId}).then(function (response) {
  //   console.log(response.data)
  //   $scope.facilityPhotosArry = response.data;
  //   $scope.facilityPhotosArry.forEach(function (photo) {
  //     if (photo.primaryPhoto === 'Y') {
  //       $scope.facility.primaryPhoto = photo.largePhoto;
  //     }
  //   });
  // });

  //get all facility photos
  dataService.get('photo', {id: $scope.userFacilityId}).then(function (response) {
    console.log(response.data);
    $scope.facilityPhotos=response.data;
  });

  $scope.closePreview=function () {
    $state.go('listingEdit')
  }

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
