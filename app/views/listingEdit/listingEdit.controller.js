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
    // dataService.get('photo',{id: $scope.userFacilityId}).then(function (response) {
    //   console.log(response.data);
    //   $scope.userFacilityPhotos=response.data;
    //   $scope.userFacilityPhotos.forEach(function (photo) {
    //     console.log(photo)
    //     var link = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacility.id + '/' + photo.smallPhoto;
    //     $scope.thumbnailArr.push(link);
    //     $scope.selectedFilesArr.push(link);
    //   });
    // });
  });

  $scope.initRoomConfig = function () {
    $scope.roomIndexes=[];

    dataService.get('facilityRooms', {id: $scope.userFacilityId}).then(function (response) {
      // console.log(response.data);
      $scope.rooms = response.data;
      for (let i = 0; i < $scope.rooms.length; i++) {
        // $scope.rooms[i].buildBedCard=false;
        $scope.roomIndexes.push($scope.rooms[i]);
      }

      dataService.get('roomBed', {id: $scope.userFacilityId}).then(function (response) {
        console.log('roomBed', response.data);
        $scope.roomBed = response.data;

        for (let i = 0; i < $scope.roomIndexes.length; i++) {
          $scope.roomIndexes[i].beds = [];

          for (let j = 0; j < $scope.roomBed.length; j++) {
            if ($scope.roomIndexes[i].roomNumber === $scope.roomBed[j].roomNumber) {
              console.log(j, $scope.roomBed[j])
              if ($scope.roomBed[j].availability === 'Occupied') {
                var availabilitydate = null;
              } else {
                availabilitydate = new Date($scope.roomBed[j].availabilitydate)
              }
              let bedObj={
                bedid: $scope.roomBed[j].bedid,
                bedNumber: $scope.roomBed[j].bednumber,
                roomNumber: $scope.roomBed[j].roomNumber,
                bedlevel: $scope.roomBed[j].bedlevel,
                availability: $scope.roomBed[j].availability,
                availabilitydate: availabilitydate
              };
              $scope.roomIndexes[i].beds.push(bedObj)
              console.log(i, $scope.roomIndexes)

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

  // $scope.roomGenderChange = function (roomNum) {
  //   console.log(roomNum, $scope.roomIndexes)
  // }

  $scope.submit = function () {
    // var loopPromises = [];

    console.log($scope.roomBed)
    //update listing
    var listing={
      id: $scope.userFacilityId,
      name: $scope.userFacility.name,
      address: $scope.userFacility.address,
      city: $scope.userFacility.city,
      state: $scope.userFacility.state,
      zip: $scope.userFacility.zip,
      specialHmFeature: $scope.userFacility.specialHmFeature,
      roomCount: $scope.userFacility.roomCount,
      level1Price: $scope.userFacility.level1Price,
      level2Price: $scope.userFacility.level2Price
    };

    //edit listing info
    dataService.edit('facility', listing).then(function (response) {
      console.log(response);
      if (response.data.status === 'success') {
        dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
          console.log('facility', response.data[0]);
          $scope.userFacility=response.data[0];
        });
      } else {
        alert('error updating')
      }
    })

    console.log($scope.roomIndexes)

    //edit bed info
    $scope.roomIndexes.forEach(function (room) {
      // var deferred = $q.defer();
      room.beds.forEach(function (bed) {
        // if (bed.availability === 'Occupied') {
        //   bed.availabilitydate = null;
        // } else if (bed.availabilitydate === null){
        //   alert('Missing availability date for Room ' + room.roomNumber)
        // } else {
        //   bed.availabilitydate = bed.availabilitydate
        // }

        let bedToEdit = {
          // facilityid: $scope.userFacilityId,
          // roomNumber: room.roomNumber,
          // roomid: room.roomid,
          bedlevel: bed.bedlevel,
          availability: bed.availability,
          availabilitydate: bed.availabilitydate,
          // bedNumber: bed.bedNumber,
          id: bed.bedid
        }

        console.log(bedToEdit)
        dataService.edit('facilityBed', bedToEdit).then(function (response) {
          console.log(response);
          // deferred.resolve();
        })

      })
    })

    // console.log(loopPromises)
    // $q.all(loopPromises).then(function () {
      // console.log('foreach loop completed. Do something after it...');

      // facilityService.set($scope.userFacility);
      // $scope.initRoomConfig()
      $state.go('listingPreview')
    // });

  }

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
