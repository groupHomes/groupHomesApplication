app.controller('ListingViewController', function($scope, $uibModal, dataService, CONSTANTS, $mdDialog, userService, facilityService) {
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

  //insert link for med and lg photo
  // $scope.facility.forEach(function (facility) {
    if ($scope.facility.mediumPhoto === 'notFound_md.jpg') {
      $scope.facility.mediumPhotoLink = "http://18.236.125.242/groupHomes/photos/notFound/notFound_md.jpg";
      $scope.facility.largePhotoLink = "http://18.236.125.242/groupHomes/photos/notFound/notFound_lg.jpg"
    } else {
      $scope.facility.mediumPhotoLink = "http://18.236.125.242/groupHomes/photos/" + $scope.facility.id + "/" + $scope.facility.mediumPhoto
      $scope.facility.largePhotoLink = "http://18.236.125.242/groupHomes/photos/" + $scope.facility.id + "/" + $scope.facility.largePhoto
    }
  // })



  // dataService.get('facility', {id: $scope.facility.id}).then(function (response) {
  //   console.log('facility', response.data[0]);
  //   $scope.userFacility=response.data[0];
  // });

  //get all photos for facility
  dataService.get('photo', {id: $scope.facility.id}).then(function (response) {
    console.log(response.data);
    $scope.facilityPhotos=response.data;
    // $scope.facilityPhotos = [
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"},
    //   {smallPhoto: "5180_sm.jpg"}
    // ]
    // $scope.facilityPhotos.forEach(function (photo) {
    //   // console.log(photo.smallPhoto)
    //   var link = 'http://18.236.125.242/groupHomes/photos/' + $scope.facility.id + '/' + photo.smallPhoto;
    //   $scope.thumbnailArr.push(link);
    //   $scope.selectedFilesArr.push(link);
    // });
  });



  $scope.showAdvanced = function(ev, selectedPhotoIndex) {
    console.log(selectedPhotoIndex)
    console.log($scope.facilityPhotos)
    console.log($scope.facility)
    event.preventDefault();
      var modalInstance = $uibModal.open({
        controller: 'ListingViewImagesController',
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: './views/modals/listingViewImages/listingViewImages.html',
        size: 'lg',
        resolve: {
          selectedPhotoIndex: function() {
            return selectedPhotoIndex
          },
          facilityPhotos: function () {
            return $scope.facilityPhotos
          },
          facility: function(){
            return $scope.facility
          }
          // empPayrates: function() {
          //   return $scope.empPayrates;
          // },
          // visitTypes: function() {
          //   return $scope.visitTypes;
          // }
        }
      });
      // $mdDialog.show({
      //   controller: 'ListingViewImagesController',
      //   templateUrl: './views/modals/listingViewImages/listingViewImages.html',
      //   parent: angular.element(document.body),
      //   targetEvent: ev,
      //   clickOutsideToClose:true,
      //   fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      //   locals: {
      //     selectedPhoto: selectedPhoto,
      //     facilityPhotos: $scope.facilityPhotos,
      //     facility: $scope.facility
      //     }
      // })
      // .then(function(answer) {
      //   $scope.status = 'You said the information was "' + answer + '".';
      // }, function() {
      //   $scope.status = 'You cancelled the dialog.';
      // });
    };

    dataService.get('hospital', {lat: $scope.facility.lat, lng:$scope.facility.lng}).then(function (response) {
      console.log(response)
      $scope.hospitals = response.data;
    })


    $scope.initDetailMap = function () {
      map = new google.maps.Map(document.getElementById('detailmap'), {
          center: { lat: parseFloat($scope.facility.lat), lng: parseFloat($scope.facility.lng) },
          zoom: 15
      });

      //build marker
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat($scope.facility.lat), parseFloat($scope.facility.lng)),
        map: map
      });

      var bounds = new google.maps.LatLngBounds();
      bounds.extend(marker.position);
    };


    $scope.initDetailMap();

});
