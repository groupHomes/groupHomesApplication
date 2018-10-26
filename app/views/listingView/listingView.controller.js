app.controller('ListingViewController', function($scope, $uibModal, dataService, CONSTANTS, $mdDialog, userService, facilityService) {
  console.log('listingView');
  document.body.scrollTop = document.documentElement.scrollTop = 0


  function getFacilityInfo() {
    $scope.facility=facilityService.get();
    getAllFacilityPhotos()
    getHospitals()
    //TESTING
    // dataService.get('facility', {id: 4729}).then(function (response) {
    //   console.log('facility', response.data[0]);
    //   $scope.facility=response.data[0];
    //   console.log($scope.facility);
    //
    //   getAllFacilityPhotos()
    //   getHospitals()
    // });
  }

  function getUserInfo() {
    $scope.user=userService.get();
  }



  //insert link for med and lg photo
  // $scope.facility.forEach(function (facility) {
    // if ($scope.facility.mediumPhoto === 'notFound_md.jpg') {
    //   $scope.facility.mediumPhotoLink = "http://18.236.125.242/groupHomes/photos/notFound/notFound_md.jpg";
    //   $scope.facility.largePhotoLink = "http://18.236.125.242/groupHomes/photos/notFound/notFound_lg.jpg"
    // } else {
    //   $scope.facility.mediumPhotoLink = "http://18.236.125.242/groupHomes/photos/" + $scope.facility.id + "/" + $scope.facility.mediumPhoto
    //   $scope.facility.largePhotoLink = "http://18.236.125.242/groupHomes/photos/" + $scope.facility.id + "/" + $scope.facility.largePhoto
    // }
  // })



  function getAllFacilityPhotos() {
    dataService.get('photo', {id: $scope.facility.id}).then(function (response) {
      console.log(response.data);
      $scope.facilityPhotos=response.data;
      // $scope.facilityPhotos.splice(1, 0, {largePhoto: $scope.facility.mediumPhoto})
      console.log($scope.facilityPhotos)

      $scope.centerIndex = 1;
      $scope.leftIndex = $scope.centerIndex - 1;
      $scope.rightIndex = $scope.centerIndex + 1;
      $scope.lastIndex = $scope.facilityPhotos.length-1
      console.log($scope.leftIndex)

      buildPhotoCarousel()
    });
  }

  function getHospitals() {
    dataService.get('hospital', {lat: $scope.facility.lat, lng:$scope.facility.lng}).then(function (response) {
      console.log(response)
      $scope.hospitals = response.data;
      $scope.hospitals.forEach(function (hospital) {
        hospital.distance = (hospital.distance).toFixed(2)
      })
      $scope.initDetailMap();
    })
  }


  $scope.showAdvanced = function(ev, selectedPhoto) {
    console.log(selectedPhoto)
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
        selectedPhoto: function() {
          return selectedPhoto
        },
        facilityPhotos: function () {
          return $scope.facilityPhotos
        },
        facility: function(){
          return $scope.facility
        }
      }
    });
  };





  $scope.initDetailMap = function () {
    map = new google.maps.Map(document.getElementById('detailmap'), {
        center: { lat: parseFloat($scope.facility.lat), lng: parseFloat($scope.facility.lng) },
        zoom: 15
    });

    //build marker
    let marker = new google.maps.Marker({
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






  // photo carousel //
  function buildPhotoCarousel() {
    $scope.imgLeftPhoto = $scope.facilityPhotos[$scope.leftIndex].largePhoto;
    $scope.imgCenterPhoto = $scope.facilityPhotos[$scope.centerIndex].largePhoto;
    $scope.imgRightPhoto = $scope.facilityPhotos[$scope.rightIndex].largePhoto;
  }

  $scope.slideLeft = function () {
    if ($scope.centerIndex === $scope.lastIndex ) {
      $scope.centerIndex = 0;
      $scope.leftIndex = $scope.lastIndex;
      $scope.rightIndex = $scope.centerIndex + 1
    } else { //else add 1 to index
      $scope.centerIndex += 1;
      $scope.leftIndex = $scope.centerIndex - 1;
      if ($scope.centerIndex === $scope.lastIndex) {
        $scope.rightIndex = 0;
      } else {
        $scope.rightIndex = $scope.centerIndex + 1;
      }
    }
    buildPhotoCarousel()
  }

  $scope.slideRight = function () {
    if ($scope.centerIndex === 0 ) {
      $scope.centerIndex = $scope.lastIndex;
      $scope.leftIndex = $scope.centerIndex - 1;
      $scope.rightIndex = 0;
    } else { //else subtract 1 to index to 'rotate carousel'
      $scope.centerIndex -= 1;
      $scope.rightIndex = $scope.centerIndex + 1;
      if ($scope.centerIndex === 0) {
        $scope.leftIndex = $scope.lastIndex;
      } else {
        $scope.leftIndex = $scope.centerIndex - 1;
      }
    }
    buildPhotoCarousel()
  }


  getFacilityInfo()
  getUserInfo()
});
