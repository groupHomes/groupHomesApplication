app.controller('ListingEditController', function($scope, $q, $location, $http, $state, dataService, fileReader, CONSTANTS, userService) {
  console.log('listingEdit');

  $scope.userFacilityId=userService.get().facilityId;
  // $scope.userFacilityId=4783

  console.log($scope.userFacilityId)

  console.log($location.path())
  $scope.thumbnailArr=[];
  $scope.selectedFilesArr=[];

  //get userFacility info
  dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
    console.log('facility', response.data[0]);
    $scope.userFacility=response.data[0];
    //get facility photos //// FIXME:
    dataService.get('photo',{id: $scope.userFacilityId}).then(function (response) {
      console.log(response.data);
      $scope.userFacilityPhotos=response.data;
      $scope.userFacilityPhotos.forEach(function (photo) {
        console.log(photo)
        var link = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacility.id + '/' + photo.smallPhoto;
        $scope.thumbnailArr.push(link);
        console.log($scope.thumbnailArr)
        // $scope.selectedFilesArr.push(link);
      });
    });
  });

  $scope.initRoomConfig = function () {
    $scope.totalRoomBedCount=0;
    $scope.totalBedsAvailable=0;
    $scope.roomIndexes=[];

    dataService.get('facilityRooms', {id: $scope.userFacilityId}).then(function (response) {
      console.log(response.data);
      $scope.rooms = response.data;
      for (let i = 0; i < $scope.rooms.length; i++) {
        // $scope.rooms[i].buildBedCard=false;
        $scope.roomIndexes.push($scope.rooms[i]);
        $scope.totalRoomBedCount += $scope.rooms[i].roomBedCount;
        $scope.totalBedsAvailable += parseInt($scope.rooms[i].bedsAvailable);
        // if ($scope.rooms[i].bedsAvailable === '1') {
        //   $scope.rooms[i].roomGender = ''
        // }
      }

      dataService.get('roomBed', {id: $scope.userFacilityId}).then(function (response) {
        console.log('roomBed', response.data);
        $scope.roomBed = response.data;

        for (let i = 0; i < $scope.roomIndexes.length; i++) {
          $scope.roomIndexes[i].beds = [];

          for (let j = 0; j < $scope.roomBed.length; j++) {
            if ($scope.roomIndexes[i].roomNumber === $scope.roomBed[j].roomNumber) {
              console.log(j, $scope.roomBed[j]);
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
              console.log(i, $scope.roomIndexes);
              $scope.originalList = angular.copy($scope.roomIndexes)
            }
            // console.log($scope.roomIndexes)
          }
        }
      });
    });
  }

  $scope.preview=function () {
    //got to view
    $state.go('listingPreview');
    // $state.go('listingView');
  }

  // $scope.submit = function () {
  //   // var loopPromises = [];
  //
  //   console.log($scope.roomBed)
  //   //update listing
  //   var listing={
  //     id: $scope.userFacilityId,
  //     name: $scope.userFacility.name,
  //     address: $scope.userFacility.address,
  //     city: $scope.userFacility.city,
  //     state: $scope.userFacility.state,
  //     zip: $scope.userFacility.zip,
  //     specialHmFeature: $scope.userFacility.specialHmFeature,
  //     roomCount: $scope.userFacility.roomCount,
  //     level1Price: $scope.userFacility.level1Price,
  //     level2Price: $scope.userFacility.level2Price
  //   };
  //
  //   //edit listing info
  //   dataService.edit('facility', listing).then(function (response) {
  //     console.log(response);
  //     if (response.data.status === 'success') {
  //       dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
  //         console.log('facility', response.data[0]);
  //         $scope.userFacility=response.data[0];
  //       });
  //     } else {
  //       alert('error updating')
  //     }
  //   })
  //
  //   console.log($scope.roomIndexes)
  //
  //   //edit bed info
  //   $scope.roomIndexes.forEach(function (room) {
  //
  //     let roomToEdit = {
  //       id: room.id,
  //       facilityid: $scope.userFacilityId,
  //       roomNumber: room.roomNumber,
  //       roomGender: room.roomGender,
  //       roomType: room.roomType,
  //     }
  //
  //     dataService.edit('facilityRooms', roomToEdit).then(function (response) {
  //       console.log('editRoomToEdit', response)
  //     })
  //
  //     // var deferred = $q.defer();
  //     room.beds.forEach(function (bed) {
  //       let bedToEdit = {
  //         // facilityid: $scope.userFacilityId,
  //         // roomNumber: room.roomNumber,
  //         // roomid: room.roomid,
  //         bedlevel: bed.bedlevel,
  //         availability: bed.availability,
  //         availabilitydate: bed.availabilitydate,
  //         // bedNumber: bed.bedNumber,
  //         id: bed.bedid
  //       }
  //
  //       console.log(bedToEdit)
  //       dataService.edit('facilityBed', bedToEdit).then(function (response) {
  //         console.log('editBedToEdit', response);
  //       })
  //
  //     })
  //   })
  // }

  $scope.submitRoom = function (room, index) {
    console.log('submit room:', room, index)

    //delete all original beds in room
    $scope.originalList[index].beds.forEach(function (bed) {
      console.log('deleting original bed:', bed)
      dataService.delete('facilityBed', {id: bed.bedid}).then(function (response) {
        console.log('delete bed:',response)
      })
    })

    //adding beds
    room.beds.forEach(function (bed) {
      console.log(bed)
      var bedToAdd = {
        facilityid: $scope.userFacilityId,
        roomNumber: room.roomNumber,
        bedlevel: bed.bedlevel,
        availability: bed.availability,
        availabilitydate: bed.availabilitydate,
        bedNumber: bed.bedNumber
      }
      console.log('bedToAdd,', bedToAdd)
      dataService.add('facilityBed', bedToAdd).then(function (response) {
        console.log(response);
      })
    })

    //edit room info
    let roomToEdit = {
      id: room.id,
      facilityid: $scope.userFacilityId,
      roomNumber: room.roomNumber,
      roomGender: room.roomGender,
      roomType: room.roomType,
    }
    dataService.edit('facilityRooms', roomToEdit).then(function (response) {
      console.log('editRoomToEdit', response)
    })
  }

  $scope.reset = function(index) {
    $scope.roomIndexes[index] = angular.copy($scope.originalList[index]);
  };


  $scope.changeAvail = function (bedAvail, bedNum, roomNum) {
    console.log(bedAvail, bedNum, roomNum)
    console.log($scope.roomIndexes)
    if (bedAvail === 'Available') {
      for (let i = 0; i < $scope.roomIndexes.length; i++) {
        if ($scope.roomIndexes[i].roomNumber === roomNum) {
          for (let j = 0; j < $scope.roomIndexes[i].beds.length; j++) {
            if ($scope.roomIndexes[i].beds[j].bedNumber == bedNum) {
              if ($scope.roomIndexes[i].beds[j].availabilitydate === null) {
                $scope.roomIndexes[i].beds[j].availabilitydate = new Date();
              }
            }
          }
        }
      }
    }
    console.log($scope.roomIndexes)

  }


  //clear bedcount
  $scope.changeRoomType = function (room) {
    console.log(room)
    if (room.roomType === 'Shared') {
      // room.buildBedCard = true;
      room.beds=[];
      room.roomBedCount=0
    } else {
      // room.buildBedCard = false;
      room.roomBedCount=1
      $scope.addRoomBedConfig(1, room.roomNumber)
    }
  }

  //adding # of beds to each room
  $scope.addRoomBedConfig=function (beds, roomnum) {

    console.log('room: ', roomnum);
    console.log('beds: ', beds);

    // console.log(index);

    // console.log($scope.roomIndexes);

    for (var i = 0; i < $scope.roomIndexes.length; i++) {

      if ($scope.roomIndexes[i].roomNumber === roomnum) {
        console.log('roommate')
        $scope.roomIndexes[i].beds = [];

        //create selected amount of bedObjs
        for (var j = 0; j < beds; j++) {
          var bedObj={
            bedNumber: (j+1),
          }
          $scope.roomIndexes[i].beds.push(bedObj);
        }
      }
    }
    console.log('$scope.roomIndexes',$scope.roomIndexes);
  };


  //adding photos
  $scope.selectFiles = function (selectedFiles) {
    console.log('selectedFiles', selectedFiles);
    console.log($scope.selectedFilesArr)
    selectedFiles.forEach(function (file) {
      fileReader.readAsDataUrl(file, $scope).then(function (response) { //convert to base64
        // console.log(response);
        $scope.thumbnailArr.push(response); //add file to thumbnail array
        console.log("adding thumbmail to $scope.thumbnailArr", $scope.thumbnailArr);
      });
      $scope.selectedFilesArr.push(file);
      console.log("adding file to $scope.selectedFilesArr", $scope.selectedFilesArr); //add to files array to be uploaded
      submitPhotos()
    });
  };

  //remove file from thumbnail array and files array
  $scope.remove=function (index, file) { //remove file from files array
    // console.log(index)
    // console.log(file)
    $scope.selectedFilesArr.splice(index, 1);
    $scope.thumbnailArr.splice(index, 1);
    console.log('removed file', $scope.selectedFilesArr);
    console.log('removed thumbnail', $scope.thumbnailArr);
  };


  function submitPhotos() {
    //upload multiple images
    $scope.selectedFilesArr.forEach(function (file) {
      console.log(file);


      // fileReader.readAsDataUrl(file, $scope).then(function (response) { //convert to base64
      //   console.log(response);
      //   $scope.test = response
      //   // $scope.thumbnailArr.push(response); //add file to thumbnail array
      //   // console.log("adding thumbmail to $scope.thumbnailArr", $scope.thumbnailArr);
      //   dataService.uploadFile('patientUpload', $scope.test).then(function(response) {
      //     console.log(response);
      //     if (response.data.status !== "success") {
      //       alert("failed to upload image");
      //     } else {
      //       $state.go('listingView');
      //     }
      //   }, function(response) {
      //     console.log(response);
      //   });
      // });

      var payload = new FormData();


      payload.append('facilityId', $scope.userFacility.id);
      payload.append('primaryPhoto', 'Y');
      payload.append('FILE', file);

      console.log('files to be uploaded', file);
      console.log('Payload: ', payload);

      dataService.uploadFile('photo', payload).then(function(response) {
        console.log(response);
        if (response.data.status !== "success") {
          alert("failed to upload image");
        } else {
          $state.go('listingView');
        }
      }, function(response) {
        console.log(response);
      });

    });
  }

  // function editBeds() {
  //   //edit bed info
  //   $scope.roomIndexes.forEach(function (room) {
  //       // var deferred = $q.defer();
  //     let bedToEdit = {
  //       // facilityid: $scope.userFacilityId,
  //       // roomNumber: room.roomNumber,
  //       // roomid: room.roomid,
  //       bedlevel: bed.bedlevel,
  //       availability: bed.availability,
  //       availabilitydate: availabilitydate,
  //       // bedNumber: bed.bedNumber,
  //       id: bed.bedid
  //     }
  //
  //     console.log(bedToEdit)
  //     dataService.edit('facilityBed', bedToEdit).then(function (response) {
  //       console.log(response);
  //       deferred.resolve();
  //     })
  //   })
  //
  //   $scope.initRoomConfig()
  //
  // }

  $scope.initRoomConfig();



});
