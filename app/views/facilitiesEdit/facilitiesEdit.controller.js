app.controller('FacilitiesEditController', function($scope, dataService, fileReader) {
  console.log('facilitiesEdit');

  function getFacilities() {
    dataService.get('facilitiesAdmin').then(function (response) {
      $scope.facilities = response.data;
      // $scope.facilities.forEach(function (facility) {
      //   dataService.get('photo', {id: facility.id}).then(function (response) {
      //     facility.photos = response.data;
      //     facility.photoInternalLinks = [];
      //     facility.photoPrimaryLink = []
      //     facility.photos.forEach(function (photo) {
      //       if (photo.primaryPhoto === 'N') {
      //         let photoLink = 'http://18.236.125.242/groupHomes/photos/' + facility.id + '/' + photo.smallPhoto;
      //         facility.photoInternalLinks.push(photoLink);
      //       } else {
      //         let photoLink = 'http://18.236.125.242/groupHomes/photos/' + facility.id + '/' + photo.smallPhoto;
      //         facility.photoPrimaryLink.push(photoLink);
      //       }
      //     })
      //     $scope.originalList = angular.copy($scope.facilities)
      //   });
      // })
        $scope.facilities.forEach(function (facility) {
          facility.photoPrimaryLink= [];
          facility.photoInternalLinks = []
        })
      $scope.originalList = angular.copy($scope.facilities)
    })
  }

  $scope.submit = function (facility) {
    console.log(facility)
    var facilityObj = {
      id: facility.id,
      specialHmFeature: facility.specialHmFeature
    }
    dataService.edit('facility', facilityObj).then(function (response) {
      console.log(response);
    });

    uploadPhotos(facility)
  }

  $scope.setFacility = function (facility) {
    $scope.currentFacility = facility
  }


  $scope.selectInternalPhotos = function (photos) {
    photos.forEach(function (photo) {
      console.log($scope.currentFacility)
      fileReader.readAsDataUrl(photo, $scope).then(function (response) { //convert to base64
        console.log(response);
        let facility = $scope.facilities.find((o, i) => {
          if (o.id === $scope.currentFacility.id) {
            $scope.facilities[i].photoInternalLinks.push(response);
            return true;
          }
        })
      });
    });
  }

  $scope.selectPrimaryPhoto = function (photo) {
    console.log(photo)
    fileReader.readAsDataUrl(photo, $scope).then(function (response) { //convert to base64
      console.log(response);
      console.log($scope.facilities)
      console.log($scope.currentFacility)
      let facility = $scope.facilities.find((o, i) => {
        if (o.id === $scope.currentFacility.id) {
          $scope.facilities[i].photoPrimaryLink.push(response);
          return true;
        }
      })
    });
  }

  function uploadPhotos(facility) {
    // //upload internal images
    if (facility.internalPhotos) {
      console.log('uploading internal photos')
      facility.internalPhotos.forEach(function (photo) {
        console.log(photo);
        var payload = new FormData();
        payload.append('facilityId', facility.id);
        payload.append('primaryPhoto', 'N');
        payload.append('FILE', photo);

        console.log('files to be uploaded', photo);
        console.log('Payload: ', payload);

        dataService.uploadFile('photo', payload).then(function(response) {
          console.log(response);
          if (response.data.status !== "success") {
            alert("failed to upload image");
          } else {
            alert("upload internal photos success");
          }
        }, function(response) {
          console.log(response);
        });
      });
    }


    //upload primary photo
    if (facility.primaryPhoto) {
      console.log('uploading primary photo')
      var payload = new FormData();
      payload.append('facilityId', facility.id);
      payload.append('primaryPhoto', 'Y');
      payload.append('FILE', facility.primaryPhoto);

      console.log('files to be uploaded', facility.primaryPhoto);
      console.log('Payload: ', payload);

      dataService.uploadFile('photo', payload).then(function(response) {
        console.log(response);
        if (response.data.status !== "success") {
          alert("failed to upload image");
        } else {
          alert("upload primary photo success");
        }
      }, function(response) {
        console.log(response);
      });
    }
  }

  $scope.reset = function(index) {
    $scope.facilities[index] = angular.copy($scope.originalList[index]);
    console.log($scope.facilities[index])
  };

  getFacilities();


})
