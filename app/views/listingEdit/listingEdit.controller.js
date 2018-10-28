app.controller('ListingEditController', function($scope, $q, $location, $http, $state, dataService, fileReader, CONSTANTS, userService) {

  $scope.userFacilityId=userService.get().facilityId;

  //get userFacility info
  dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
    $scope.userFacility=response.data[0];
    $scope.originalUserFacility = angular.copy($scope.userFacility)
    //get facility photos
    dataService.get('photo',{id: $scope.userFacilityId}).then(function (response) {
      console.log(response.data);
      $scope.userFacilityPhotos=response.data;
      $scope.userFacilityPhotos.forEach(function (photo) {
        if (photo.primaryPhoto === 'N') {
          photo.photoLink = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacilityId + '/' + photo.smallPhoto;
        } else {
          photo.photoLink = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacilityId + '/' + photo.smallPhoto;
        }
      });
    });
  });

  $scope.initRoomConfig = function () {
    $scope.totalRoomBedCount=0;
    $scope.totalBedsAvailable=0;
    $scope.roomIndexes=[];

    dataService.get('facilityRooms', {id: $scope.userFacilityId}).then(function (response) {
      $scope.rooms = response.data;
      for (let i = 0; i < $scope.rooms.length; i++) {
        $scope.roomIndexes.push($scope.rooms[i]);
        $scope.totalRoomBedCount += $scope.rooms[i].roomBedCount;
        $scope.totalBedsAvailable += parseInt($scope.rooms[i].bedsAvailable);
      }

      dataService.get('roomBed', {id: $scope.userFacilityId}).then(function (response) {
        $scope.roomBed = response.data;
        for (let i = 0; i < $scope.roomIndexes.length; i++) {
          $scope.roomIndexes[i].beds = [];
          for (let j = 0; j < $scope.roomBed.length; j++) {
            if ($scope.roomIndexes[i].roomNumber === $scope.roomBed[j].roomNumber) {
              if ($scope.roomBed[j].availability === 'Occupied') {
                var availabilitydate = null;
              } else {
                availabilitydate = new Date($scope.roomBed[j].availabilitydate);
              }
              let bedObj={
                bedid: $scope.roomBed[j].bedid,
                bedNumber: $scope.roomBed[j].bednumber,
                roomNumber: $scope.roomBed[j].roomNumber,
                bedlevel: $scope.roomBed[j].bedlevel,
                availability: $scope.roomBed[j].availability,
                availabilitydate: availabilitydate
              };
              $scope.roomIndexes[i].beds.push(bedObj);
              $scope.originalList = angular.copy($scope.roomIndexes)
            }
          }
        }
      });
    });
  }

  $scope.preview=function () {
    //got to view
    $state.go('listingPreview');
  }

  $scope.submitFacility = function (item, item2, item3, item4) {
    let obj = {
      id: $scope.userFacility.id,
    }
    obj[item] = $scope.userFacility[item]

    if (item2) {
      obj[item2] = $scope.userFacility[item2]
    }
    if (item3) {
      obj[item3] = $scope.userFacility[item3]
    }
    if (item4) {
      obj[item4] = $scope.userFacility[item4]
    }
    dataService.edit('facility', obj).then(function (response) {
      if (response.data.status === 'success') {
        dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
          $scope.userFacility[item]=response.data[0][item];
          if (item2) {
            $scope.userFacility[item2] = response.data[0][item2]
          }
          if (item3) {
            $scope.userFacility[item3] = response.data[0][item3]
          }
          if (item4) {
            $scope.userFacility[item4] = response.data[0][item4]
          }
        });
      } else {
        alert('error updating')
      }
    })
  }

  $scope.submitPrice = function () {
    let obj = {
      id: $scope.userFacility.id,
      category1PrivateMinRange: $scope.userFacility.category1PrivateMinRange,
      category1PrivateMaxRange: $scope.userFacility.category1PrivateMaxRange,
      category1SharedMinRange: $scope.userFacility.category1SharedMinRange,
      category1SharedMaxRange: $scope.userFacility.category1SharedMaxRange,
      category2PrivateMinRange: $scope.userFacility.category2PrivateMinRange,
      category2PrivateMaxRange: $scope.userFacility.category2PrivateMaxRange,
      category2SharedMinRange: $scope.userFacility.category2SharedMinRange,
      category2SharedMaxRange: $scope.userFacility.category2SharedMaxRange,
      medicaidSharedMinRange: $scope.userFacility.medicaidSharedMinRange,
      medicaidSharedMaxRange: $scope.userFacility.medicaidSharedMaxRange,
      medicaidPrivateMinRange: $scope.userFacility.medicaidPrivateMinRange,
      medicaidPrivateMaxRange: $scope.userFacility.medicaidPrivateMaxRange,
    }
    dataService.edit('facility', obj).then(function (response) {
      console.log(response);
      if (response.data.status === 'success') {
        dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
          $scope.userFacility.category1PrivateMinRange=response.data[0].category1PrivateMinRange;
          $scope.userFacility.category1PrivateMaxRange=response.data[0].category1PrivateMaxRange;
          $scope.userFacility.category1SharedMinRange=response.data[0].category1SharedMinRange;
          $scope.userFacility.category1SharedMaxRange=response.data[0].category1SharedMaxRange;
          $scope.userFacility.category2PrivateMinRange=response.data[0].category2PrivateMinRange;
          $scope.userFacility.category2PrivateMaxRange=response.data[0].category2PrivateMaxRange;
          $scope.userFacility.category2SharedMinRange=response.data[0].category2SharedMinRange;
          $scope.userFacility.category2SharedMaxRange=response.data[0].category2SharedMaxRange;
          $scope.userFacility.medicaidSharedMinRange=response.data[0].medicaidSharedMinRange;
          $scope.userFacility.medicaidSharedMaxRange=response.data[0].medicaidSharedMaxRange;
          $scope.userFacility.medicaidPrivateMinRange=response.data[0].medicaidPrivateMinRange;
          $scope.userFacility.medicaidPrivateMaxRange=response.data[0].medicaidPrivateMaxRange;
        });
      } else {
        alert('error updating')
      }
    })
  }

  $scope.resetFacility = function (item, item2, item3, item4) {
    $scope.userFacility[item] = angular.copy($scope.originalUserFacility[item]);
    if (item2) {
      $scope.userFacility[item2] = angular.copy($scope.originalUserFacility[item2])
    }
    if (item3) {
      $scope.userFacility[item3] = angular.copy($scope.originalUserFacility[item3])
    }
    if (item4) {
      $scope.userFacility[item4] = angular.copy($scope.originalUserFacility[item4])
    }
  }

  $scope.resetPrice = function () {
    $scope.userFacility.category1PrivateMinRange=angular.copy($scope.originalUserFacility.category1PrivateMinRange);
    $scope.userFacility.category1PrivateMaxRange=angular.copy($scope.originalUserFacility.category1PrivateMaxRange);
    $scope.userFacility.category1SharedMinRange=angular.copy($scope.originalUserFacility.category1SharedMinRange);
    $scope.userFacility.category1SharedMaxRange=angular.copy($scope.originalUserFacility.category1SharedMaxRange);
    $scope.userFacility.category2PrivateMinRange=angular.copy($scope.originalUserFacility.category2PrivateMinRange);
    $scope.userFacility.category2PrivateMaxRange=angular.copy($scope.originalUserFacility.category2PrivateMaxRange);
    $scope.userFacility.category2SharedMinRange=angular.copy($scope.originalUserFacility.category2SharedMinRange);
    $scope.userFacility.category2SharedMaxRange=angular.copy($scope.originalUserFacility.category2SharedMaxRange);
    $scope.userFacility.medicaidSharedMinRange=angular.copy($scope.originalUserFacility.medicaidSharedMinRange);
    $scope.userFacility.medicaidSharedMaxRange=angular.copy($scope.originalUserFacility.medicaidSharedMaxRange);
    $scope.userFacility.medicaidPrivateMinRange=angular.copy($scope.originalUserFacility.medicaidPrivateMinRange);
    $scope.userFacility.medicaidPrivateMaxRange=angular.copy($scope.originalUserFacility.medicaidPrivateMaxRange);
  }

  $scope.submitRoom = function (room, index) {
    //edit room info
    let roomToEdit = {
      id: room.roomid,
      roomGender: room.roomGender,
      bedsAvailable: room.bedsAvailable
    }
    console.log('roomToEdit', roomToEdit)
    dataService.edit('facilityRooms', roomToEdit).then(function (response) {
      console.log('editRoomToEdit', response)
    })

    //edit bed info
    room.beds.forEach(function (bed) {
      var bedToEdit = {
        id: bed.bedid,
        availability: bed.availability,
        availabilitydate: bed.availabilitydate,
      }
      // if (bed.bedlevel === 'Custom') {
      //   bedToEdit.bedlevelcustom = bed.bedlevelcustom
      // } else {
      //   bedToEdit.bedlevelcustom = null
      // }
      console.log('bedToEdit,', bedToEdit)
      dataService.edit('facilityBed', bedToEdit).then(function (response) {
        console.log('editBedToEdit', response);
        $scope.initRoomConfig()
      })
    })
  }

  $scope.reset = function(index) {
    $scope.roomIndexes[index] = angular.copy($scope.originalList[index]);
  };


  $scope.changeAvail = function (bedAvail, bedNum, roomNum) {
    if (bedAvail === 'Available') {
      for (let i = 0; i < $scope.roomIndexes.length; i++) {
        if ($scope.roomIndexes[i].roomNumber === roomNum) {
          $scope.roomIndexes[i].bedsAvailable += 1
          for (let j = 0; j < $scope.roomIndexes[i].beds.length; j++) {
            if ($scope.roomIndexes[i].beds[j].bedNumber == bedNum) {
              if ($scope.roomIndexes[i].beds[j].availabilitydate === null) {
                $scope.roomIndexes[i].beds[j].availabilitydate = new Date();
              }
            }
          }
        }
      }
    } else {
      for (let i = 0; i < $scope.roomIndexes.length; i++) {
        if ($scope.roomIndexes[i].roomNumber === roomNum) {
          $scope.roomIndexes[i].bedsAvailable -= 1
          for (let j = 0; j < $scope.roomIndexes[i].beds.length; j++) {
            if ($scope.roomIndexes[i].beds[j].bedNumber == bedNum) {
              $scope.roomIndexes[i].beds[j].availabilitydate = null;
            }
          }
        }
      }
    }
  }

  //add primary photo
  $scope.selectPrimaryPhoto = function (photo) {
    var payload = new FormData();
    payload.append('facilityId', $scope.userFacilityId);
    payload.append('primaryPhoto', 'Y');
    payload.append('FILE', photo);
    dataService.uploadFile('photo', payload).then(function(response) {
      if (response.data.status !== "success") {
        alert("failed to upload image");
      } else {
        alert("upload primary photos success");
        dataService.get('photo',{id: $scope.userFacilityId}).then(function (response) {
          $scope.userFacilityPhotos=response.data;
          $scope.userFacilityPhotos.forEach(function (photo) {
             if (photo.primaryPhoto === 'N') {
               photo.photoLink = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacilityId + '/' + photo.smallPhoto;
             } else {
               photo.photoLink = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacilityId + '/' + photo.smallPhoto;
             }
          });
        });
      }
    }, function(response) {
      console.log(response);
    });
  };

  //add internal photo
  $scope.selectInternalPhotos = function (photos) {
    photos.forEach(function (photo) {
      var payload = new FormData();
      payload.append('facilityId', $scope.userFacilityId);
      payload.append('primaryPhoto', 'N');
      payload.append('FILE', photo);

      dataService.uploadFile('photo', payload).then(function(response) {
        if (response.data.status !== "success") {
          alert("failed to upload image");
        } else {
          alert("upload internal photos success");
          dataService.get('photo',{id: $scope.userFacilityId}).then(function (response) {
            $scope.userFacilityPhotos=response.data;
            $scope.userFacilityPhotos.forEach(function (photo) {
               if (photo.primaryPhoto === 'N') {
                 photo.photoLink = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacilityId + '/' + photo.smallPhoto;
               } else {
                 photo.photoLink = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacilityId + '/' + photo.smallPhoto;
               }
            });
          });
        }
      }, function(response) {
        console.log(response);
      });
    })
  }

  //delete photo
  $scope.removePhoto = function (photo) {
    dataService.delete('photo', {id: photo.photoid}).then(function (response) {
      dataService.get('photo',{id: $scope.userFacilityId}).then(function (response) {
        $scope.userFacilityPhotos=response.data;
        $scope.userFacilityPhotos.forEach(function (photo) {
           if (photo.primaryPhoto === 'N') {
             photo.photoLink = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacilityId + '/' + photo.smallPhoto;
           } else {
             photo.photoLink = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacilityId + '/' + photo.smallPhoto;
           }
        });
      });
    })
  };

  $scope.initRoomConfig();
});
