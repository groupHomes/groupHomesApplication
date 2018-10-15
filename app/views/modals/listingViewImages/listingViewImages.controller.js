app.controller('ListingViewImagesController', function($scope, $uibModalInstance, dataService, facility, CONSTANTS, $mdDialog, facilityPhotos, selectedPhoto) {
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
  $scope.selectedPhoto = {largePhoto: selectedPhoto}
  $scope.facility = facility
  $scope.facilityPhotos = facilityPhotos

  console.log(selectedPhoto)
  console.log(facilityPhotos)
  // var facilityPhotos = facilityPhotos

  function findPhotoIndex() {
    $scope.selectedPhotoIndex = $scope.facilityPhotos.findIndex(obj => obj.largePhoto === $scope.selectedPhoto.largePhoto)
    console.log($scope.selectedPhotoIndex)
  }



  $scope.close=function () {
    $uibModalInstance.close();
  };

  $scope.leftPhoto = function () {
    console.log('left')
    if ($scope.selectedPhotoIndex !== 0) {
      $scope.selectedPhotoIndex -= 1;
      $scope.selectedPhoto = $scope.facilityPhotos[$scope.selectedPhotoIndex]
      console.log($scope.selectedPhotoIndex)
    }
  }

  $scope.rightPhoto = function () {
    console.log('right')

    if ($scope.selectedPhotoIndex !== ($scope.facilityPhotos.length - 1) )
    $scope.selectedPhotoIndex += 1;
    $scope.selectedPhoto = $scope.facilityPhotos[$scope.selectedPhotoIndex]
  }

  findPhotoIndex()
})
