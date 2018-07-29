app.controller('ListingViewImagesController', function($scope, dataService, facility, CONSTANTS, $mdDialog, facilityPhotos) {
  console.log('listingViewImages');

  // $scope.files=[
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=1",
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=2",
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=3",
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=4",
  //   "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=5",
  // ]

  $scope.loadAll = function() {
    dataService.get('patientUpload', {'PATID' : '1'}).then(function(data) {
      $scope.files = data.data;
      console.log('files', $scope.files);
      angular.forEach($scope.files, function(file) {
        file.LINK = CONSTANTS.api.baseUrl + CONSTANTS.api.path + CONSTANTS.api.query + "getPatientUploadFile&KEYID=" + file.KEYID;
        console.log("link: " + file.LINK);
      });
    });
  };
  // $scope.loadAll();
  // console.log(facility)
  // console.log(facilityPhotos)
  $scope.facility=facility
  $scope.facilityPhotos=facilityPhotos;

  $scope.cancel = function() {
     $mdDialog.cancel();
   };
})
