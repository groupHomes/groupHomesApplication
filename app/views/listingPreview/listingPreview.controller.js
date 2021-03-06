app.controller('ListingPreviewController', function($scope, dataService, CONSTANTS, $mdDialog, userService, facilityService, $state) {
  console.log('listingPreview');

  $scope.user=userService.get();
  console.log($scope.user);

  $scope.userFacilityId=userService.get().facilityId;


  //get user facility info
  dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
    console.log('facility', response.data[0]);
    $scope.facility=response.data[0]; //FIXME lat and lng not returned with object
    //get closest hospital info
    dataService.get('hospital', {lat: $scope.facility.lat, lng:$scope.facility.lng}).then(function (response) {
      console.log(response)
      $scope.hospitals = response.data;
      $scope.hospitals.forEach(function (hospital) {
          hospital.distance = (hospital.distance).toFixed(2)
      })
      //init map
      $scope.initDetailMap();
    })



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




  $scope.initDetailMap = function () {
    console.log($scope.facility)
    map = new google.maps.Map(document.getElementById('detailmap'), {
        center: { lat: parseFloat($scope.facility.lat), lng: parseFloat($scope.facility.lng) },
        zoom: 15
    });

    //build marker
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat($scope.facility.lat), parseFloat($scope.facility.lng)),
      map: map
    });

    //build hospital markers
    for (i = 0; i < $scope.hospitals.length; i++) {
      //create a marker for each facaility
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.hospitals[i].lat, $scope.hospitals[i].lng),
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/hospitals.png"
      });
    }

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(marker.position);
  };




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
