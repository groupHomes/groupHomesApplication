app.controller('ListingViewImagesController', function($scope, dataService, facility, CONSTANTS, $mdDialog, facilityPhotos, selectedPhotoIndex) {
  console.log('listingViewImages');

  // $scope.files=[
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=1",
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=2",
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=3",
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=4",
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=5",
  // ]

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
  var selectedPhotoIndex = selectedPhotoIndex
  // var facilityPhotos = facilityPhotos

  $scope.facility=facility
  $scope.selectedPhoto = facilityPhotos[selectedPhotoIndex]

  $scope.close=function () {
    $uibModalInstance.close();
  };

  $scope.leftPhoto = function () {
    console.log('left')
    if (selectedPhotoIndex !== 0) {
      selectedPhotoIndex -= 1;
      $scope.selectedPhoto = facilityPhotos[selectedPhotoIndex]
    }
  }

  $scope.rightPhoto = function () {
    console.log('right')

    if (selectedPhotoIndex !== (facilityPhotos.length - 1) )
    selectedPhotoIndex += 1;
    $scope.selectedPhoto = facilityPhotos[selectedPhotoIndex]
  }

})
