app.controller('ListingCreateController', function($scope, $q,  $http, $state, dataService, fileReader, CONSTANTS, userService, facilityService) {
  console.log('listingCreate');


  // $scope.userFacilityId=userService.get().facilityId;
  // $scope.userFacilityId=2864; adding didn't work
  // $scope.userFacilityId=4729;
  // $scope.userFacilityId=3750; adding didnt work
  // $scope.userFacilityId=4215;
  $scope.userFacilityId=4749;

  $scope.todayDate = new Date();
  //
  // $scope.userFacilityId = $scope.user.userFacilityId
  console.log('userFacilityId', $scope.userFacilityId);

  //get userFacility info
  dataService.get('facility', {id: $scope.userFacilityId}).then(function (response) {
    console.log('facility', response.data[0]);
    $scope.userFacility=response.data[0];
    // if ($scope.userFacility.roomCount > 0) {
      // $scope.buildRoomCard=false;
      // $scope.initRoomConfig();
    // } else {
      // $scope.buildRoomCard=true;
    // }
    //get userFacility photos
    dataService.get('photo',{id: $scope.userFacilityId}).then(function (response) {
      console.log(response.data);
      $scope.userFacilityPhotos=response.data;
      $scope.userFacilityPhotos.forEach(function (photo) {
        // console.log(photo.smallPhoto)
        var link = 'http://18.236.125.242/groupHomes/photos/' + $scope.userFacility.id + '/' + photo.smallPhoto;
        $scope.thumbnailArr.push(link);
        $scope.selectedFilesArr.push(link);
      });
    });
  });


  // $scope.initRoomConfig = function () {
  //   $scope.roomIndexes=[];
  //
  //   dataService.get('facilityRooms', {id: $scope.userFacilityId}).then(function (response) {
  //     console.log(response.data);
  //     $scope.rooms = response.data;
  //     for (var i = 0; i < $scope.rooms.length; i++) {
  //       // $scope.rooms[i].buildBedCard=false;
  //       $scope.roomIndexes.push($scope.rooms[i]);
  //     }
  //
  //     dataService.get('roomBed', {id: $scope.userFacilityId}).then(function (response) {
  //       console.log('roomBed', response.data);
  //       $scope.roomBed = response.data;
  //
  //       for (var i = 0; i < $scope.roomIndexes.length; i++) {
  //         $scope.roomIndexes[i].beds = [];
  //
  //         for (var j = 0; j < $scope.roomBed.length; j++) {
  //           if ($scope.roomIndexes[i].roomNumber === $scope.roomBed[j].roomNumber) {
  //             var bedObj={
  //               bedid: $scope.roomBed[j].bedid,
  //               bedNumber: $scope.roomBed[j].bednumber,
  //               roomNumber: $scope.roomBed[j].roomNumber,
  //               bedlevel: $scope.roomBed[j].bedlevel,
  //               availability: $scope.roomBed[j].availability,
  //               availabilitydate: $scope.roomBed[j].availabilitydate
  //             };
  //             $scope.roomIndexes[i].beds.push(bedObj)
  //           }
  //           console.log($scope.roomIndexes)
  //         }
  //       }
  //     });
  //   });
  // }


  //add room configuration card
  $scope.addRoomConfig=function () {
    $scope.roomIndexes=[];
    console.log($scope.userFacility.roomCount)
    for (var i = 0; i < $scope.userFacility.roomCount; i++) {
      var roomObj = {
        roomNumber: (i+1),
        // buildBedCard: true
      }
      $scope.roomIndexes.push(roomObj);
    }
    console.log($scope.roomIndexes)
  };

  // $scope.roomIndexes[i].roomBedCount = [];

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



//BASE64 ENCODED
  // $scope.submit = function() {
  //      if ($scope.form.file.$valid && $scope.file) {
  //        console.log($scope.file)
  //
  //        fileReader.readAsDataUrl($scope.file, $scope).then(function (response) {
  //          console.log(response)
  //          //testing only
  //          $scope.imageSrc = response
  //          dataService.uploadFile('uploadFile', response).then(function (response) {
  //            console.log(response);
  //          })
  //        })
  //       //  $scope.upload($scope.file);
  //      }
  //    };

  //adding photos
  $scope.thumbnailArr=[];
  $scope.selectedFilesArr=[];

  $scope.selectFiles = function (selectedFiles) {
    // console.log('selectedFiles', selectedFiles);
    selectedFiles.forEach(function (file) {
      fileReader.readAsDataUrl(file, $scope).then(function (response) { //convert to base64
        // console.log(response);
        $scope.thumbnailArr.push(response); //add file to thumbnail array
        console.log("adding thumbmail to $scope.thumbnailArr", $scope.thumbnailArr);
      });
      $scope.selectedFilesArr.push(file);
      console.log("adding file to $scope.selectedFilesArr", $scope.selectedFilesArr); //add to files array to be uploaded
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

  //upload multiple allowed
  $scope.submit = function() {
    var loopPromises = [];
    //upload multiple images
    // $scope.selectedFilesArr.forEach(function (file) {
    //   console.log(file);
    //   var payload = new FormData();
    //
    //   payload.append('FACILLITYID', $scope.userFacility.id);
    //   payload.append('ADDEDBY', 'test');
    //   payload.append('TITLE', 'test');
    //   payload.append('NOTES', 'test');
    //   payload.append('FILE', file);
    //
    //   console.log('files to be uploaded', file);
    //   console.log('Payload: ', payload);
    //   dataService.uploadFile('patientUpload', payload).then(function(response) {
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

    //create listing
    var listing={
      id: $scope.userFacilityId,
      name: $scope.userFacility.name,
      address: $scope.userFacility.address,
      // ADDRESS2: $scope.ADDRESS2,
      city: $scope.userFacility.city,
      state: $scope.userFacility.state,
      zip: $scope.userFacility.zip,
      specialHmFeature: $scope.userFacility.specialHmFeature,
      roomCount: $scope.userFacility.roomCount,
      level1Price: $scope.userFacility.level1Price,
      level2Price: $scope.userFacility.level2Price
      // photos: $scope.thumbnailArr
    };

    dataService.edit('facility', listing).then(function (response) {
      console.log(response);
    });

    console.log('listing:', listing);
    console.log('rooms:', $scope.roomIndexes);

    //adding rooms
    $scope.roomIndexes.forEach(function (room) {
      var deferred = $q.defer();
      // var loopPromises = [];
      loopPromises.push(deferred.promise);

      console.log(deferred);
      console.log(room);
      var roomToAdd = {
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        facilityid: $scope.userFacilityId,
        roomGender: room.roomGender
      }
      console.log('roomToAdd,', roomToAdd);
      dataService.add('facilityRooms', roomToAdd).then(function (response) {
        console.log(response);
      });
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
          deferred.resolve();
        })

      })

    });

    $q.all(loopPromises).then(function () {
      // console.log('foreach loop completed. Do something after it...');

      facilityService.set($scope.userFacility);

      $state.go('listingView')
    });

  };



  //upload single allowed
  // $scope.submit = function() {
  //   console.log($scope.file);
  //   var payload = new FormData();
  //
  //   payload.append('PATID', '1');
  //   payload.append('ADDEDBY', 'test');
  //
  //   payload.append('TITLE', 'test');
  //   payload.append('NOTES', 'test');
  //   payload.append('FILE', $scope.file);
  //
  //   console.log('file to be uploaded', $scope.file);
  //   console.log('Payload: ', payload);
  //   dataService.uploadFile('patientUpload', payload).then(function(response) {
  //     console.log(response);
  //   }, function(response) {
  //     console.log(response);
  //   });
  // };


    //UPLOADCARE
  //   function installWidgetPreviewMultiple(widget, list) {
  //     widget.onChange(function(fileGroup) {
  //       list.empty();
  //       if (fileGroup) {
  //         $.when.apply(null, fileGroup.files()).done(function() {
  //           $.each(arguments, function(i, fileInfo) {
  //             var src = fileInfo.cdnUrl + '-/scale_crop/160x160/center/';
  //             console.log('send link to database', fileInfo.cdnUrl + fileInfo.name)
  //             $scope.images.push(fileInfo.cdnUrl + fileInfo.name);
  //             console.log($scope.images)
  //             list.append(
  //               $('<div/>', {'class': '_item'}).append(
  //                 [$('<img/>', {src: src}), fileInfo.name])
  //             );
  //           });
  //         });
  //       }
  //     });
  //   }
  // $(function() {
  //   $('.image-preview-multiple').each(function() {
  //     installWidgetPreviewMultiple(
  //       uploadcare.MultipleWidget($(this).children('input')),
  //       $(this).children('._list')
  //     );
  //   });
  // });
//
// $scope.test=function () {
//   uploadcare.openDialog(null, {
//   imagesOnly: true,
//   multiple: false
// }).done(function(file) {
//   file.promise().done(function(fileInfo){
//     // console.log(fileInfo.cdnUrl);
//     $scope.imageSrc=fileInfo.cdnUrl + fileInfo.name
//     console.log($scope.imageSrc)
//   });
// });
// }

//
//   $scope.images = [
//     "https://ucarecdn.com/3c27740a-5d40-4ef8-b458-280712830a71/camera75.jpg",
// "https://ucarecdn.com/59f4b66d-ddfd-4119-9cf1-4caedd3e6f1c/header-old.jpg"
//   ]



// http://52.37.19.44/examApp.api/php?x=getPatientUpload&KEYID=1

// http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=1

$scope.testrooms=[
    {
      'roomNumber': 'ROOM1',
      'roomType': 'FEMALE',
      'NUMOFBEDS': [
        {
          'BEDNAME': 'BED1',
          'BEDPRICE': '400',
        },
        {
          'BEDNAME': 'BED2',
          'BEDPRICE': '300',
        }
      ]
    },
    {
      'roomNumber': 'ROOM2',
      'roomType': 'MALE',
      'NUMOFBEDS': [
        {
          'roomNumber': 'ROOM2',
          'BEDNAME': 'BED1',
          'BEDPRICE': '10',
        },
        {
          'roomNumber': 'ROOM2',
          'BEDNAME': 'BED2',
          'BEDPRICE': '30',
        }
      ]
    }
  ];


});
