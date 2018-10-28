app.controller('FacilitiesEditController', function($scope, dataService, fileReader) {

  function getFacilities() {
    dataService.get('facilitiesAdmin').then(function (response) {
      $scope.facilities = response.data;
      $scope.facilities.forEach(function (facility) {
        facility.photoPrimaryLink= [];
        facility.photoInternalLinks = []
      })
      $scope.originalList = angular.copy($scope.facilities)
    })
  }

  $scope.submit = function (facility) {
    var facilityObj = {
      id: facility.id,
      name: facility.name,
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
    fileReader.readAsDataUrl(photo, $scope).then(function (response) { //convert to base64
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
      facility.internalPhotos.forEach(function (photo) {
        var payload = new FormData();
        payload.append('facilityId', facility.id);
        payload.append('primaryPhoto', 'N');
        payload.append('FILE', photo);
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
      var payload = new FormData();
      payload.append('facilityId', facility.id);
      payload.append('primaryPhoto', 'Y');
      payload.append('FILE', facility.primaryPhoto);
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
  };

  getFacilities();
})
