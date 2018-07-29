app.controller('ListingEditController', function($scope, $http, $state, dataService, fileReader, CONSTANTS, userService) {
  console.log('listingEdit');

  // $scope.userFacilityId=userService.get().facilityId;
  $scope.userFacilityId=4783

  console.log($scope.userFacilityId)


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
      console.log(response.data);
      $scope.rooms = response.data;
      for (var i = 0; i < $scope.rooms.length; i++) {
        // $scope.rooms[i].buildBedCard=false;
        $scope.roomIndexes.push($scope.rooms[i]);
      }

      dataService.get('roomBed', {id: $scope.userFacilityId}).then(function (response) {
        console.log('roomBed', response.data);
        $scope.roomBed = response.data;

        for (var i = 0; i < $scope.roomIndexes.length; i++) {
          $scope.roomIndexes[i].beds = [];

          for (var j = 0; j < $scope.roomBed.length; j++) {
            if ($scope.roomIndexes[i].roomNumber === $scope.roomBed[j].roomNumber) {
              var bedObj={
                bedid: $scope.roomBed[j].bedid,
                bedNumber: $scope.roomBed[j].bednumber,
                roomNumber: $scope.roomBed[j].roomNumber,
                bedlevel: $scope.roomBed[j].bedlevel,
                availability: $scope.roomBed[j].availability,
                availabilitydate: $scope.roomBed[j].availabilitydate
              };
              $scope.roomIndexes[i].beds.push(bedObj)
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

  }

  $scope.initRoomConfig();



});
