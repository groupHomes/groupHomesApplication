app.controller('ListingSearchController', function($scope, $transitions, $rootScope, $location, dataService, CONSTANTS, $window, $compile, $state, facilityService, userService, searchService) {

  ////////////////////GOOGLE MAPS///////////////////////////////
  var map;
  var marker;
  $scope.markerArr = [];
  $scope.hospitalMarkerArr = []
  var circle, circlemarker;
  var initLat = 36.1699; //36.13842925; //36.125541;
  var initLng = -115.1398; //-115.1717376708;
  // var userKey = "AIzaSyDsWy4Qwn4FJ4iQ8Ufr-GM1FQssMxG1msY";  //"AIzaSyB9I2qkvtn821Tc7cGJ5v9JoX8AUiv6SUw";
  var infowindow = new google.maps.InfoWindow();
  //////////GOOGLE MAPS END///////////////////

  //set user to scope
  $scope.user = userService.get();

  //hospital array
  $scope.hospitalArr = []

  //create array of selected facilities to be compared
  $scope.compareArr = [];

  function setSearch() {
    console.log('set search')
    let search = searchService.get();

    //if no search text, then start with empty map
    if (search === undefined) {
      $scope.facilities=[];
      //setting initial search filters
      $scope.searchFilterObj = {
        searchGroupHomeHIC: true,
        searchGroupHomeAGC: true,
        searchGenderMale: true,
        searchGenderFemale: true,
        searchRoomTypePrivate: true,
        searchRoomTypeShared: true,
        searchMinPrice: 0,
        searchMaxPrice: 9999,
        searchMedicaid: false
      }
      $scope.initMap();
    } else { //else load search results and init map
      $scope.facilities = JSON.parse(JSON.stringify( search.searchResult )); //makes a copy of results
      $scope.searchFilterObj = search.searchFilterObj
      createHospitalArr();
      createImageLink()

      $scope.searchText = search.searchText;
      $scope.initMap();

      //if the user is logged in, set preferred facilities list
      if ($scope.user) {
        setCompareArr()
      }
    }
  }

  function setCompareArr() {
    $scope.compareArr=[]
    dataService.get('preferredFacilities', {userid: $scope.user.userid}).then(function (response) {
      response.data.forEach(function (preferred) {
        $scope.compareArr.push(preferred.id)
      })
      //add selected heart to facility card
      for (var i = 0; i < $scope.facilities.length; i++) {
        for (var j = 0; j < response.data.length; j++) {
          if ($scope.facilities[i].id === response.data[j].id) {
            $scope.facilities[i].compare = true;
          }
        }
      }
    });
  }

  function createHospitalArr() {
    //remove all hospital type and create array of type hospital
    $scope.hospitalArr = $scope.facilities.filter(x => x.type ==='HOS');
    $scope.facilities = $scope.facilities.filter(x => x.type !=='HOS');
  }

  function createImageLink() {
    //instead photo link
    $scope.facilities.forEach(function (facility) {
      if (facility.smallPhoto !== 'notFound_sm.jpg') {
        facility.smallPhotoLink = "http://18.236.125.242/groupHomes/photos/" + facility.id + "/" + facility.smallPhoto
      } else {
        facility.smallPhotoLink = "http://18.236.125.242/groupHomes/photos/notFound/notFound_sm.jpg"
      }
    })
  }

  //search for facility
  $scope.submit = function (search) {
    console.log(search)
    // clear old markers and facilities
    $scope.facilities = [];
    $scope.hospitalArr = [];
    $scope.toggleShowAll = false;

     for (var i = 0; i < $scope.markerArr.length; i++) {
      $scope.markerArr[i].setMap(null);
    }
    $scope.markerArr.length=0;

    for (var i = 0; i < $scope.hospitalMarkerArr.length; i++) {
      $scope.hospitalMarkerArr[i].setMap(null);
    }
    $scope.hospitalMarkerArr.length=0;

    var searchGender;
    var searchRoomType;
    var searchFacilityType;
    var searchMinPrice;
    var searchMaxPrice;
    var searchMedicaid;

    //setting search gender
    if ($scope.searchFilterObj.searchGenderMale && $scope.searchFilterObj.searchGenderFemale) {
      searchGender = "'Female', 'Male'"
    } else if($scope.searchFilterObj.searchGenderMale) {
      searchGender = "'Male'"
    } else if ($scope.searchFilterObj.searchGenderFemale){
      searchGender = "'Female'"
    } else {
      searchGender = "'Female', 'Male'"
    }

    //setting room type
    if ($scope.searchFilterObj.searchRoomTypeShared && $scope.searchFilterObj.searchRoomTypePrivate) {
      searchRoomType = "'Shared', 'Private'"
    } else if($scope.searchFilterObj.searchRoomTypeShared) {
      searchRoomType = "'Shared'"
    } else if($scope.searchFilterObj.searchRoomTypePrivate) {
      searchRoomType = "'Private'"
    } else {
      searchRoomType = "'Shared', 'Private'"
    }

    //setting group home type
    if ($scope.searchFilterObj.searchGroupHomeAGC && $scope.searchFilterObj.searchGroupHomeHIC) {
      searchFacilityType = "'AGC', 'HIC'"
    } else if($scope.searchFilterObj.searchGroupHomeAGC) {
      searchFacilityType = "'AGC'"
    } else if($scope.searchFilterObj.searchGroupHomeHIC){
      searchFacilityType = "'HIC'"
    } else {
      searchFacilityType = "'AGC', 'HIC'"
    }

    //setting price
    // switch ($scope.searchFilterObj.searchPrice) {
    //   case '< $1000':
    //     searchPrice = 1000;
    //     break;
    //   case '< $2000':
    //     searchPrice = 2000;
    //     break;
    //   case '< $3000':
    //     searchPrice = 3000;
    //     break;
    //   case '< $4000':
    //     searchPrice = 4000;
    //     break;
    //   case 'Any Price':
    //     searchPrice = 9999;
    //     break;
    //   default:
    // }
    if (!$scope.searchFilterObj.searchMaxPrice) {
      $scope.searchFilterObj.searchMaxPrice = 9999
      searchMaxPrice = 9999
    } else {
      searchMaxPrice = $scope.searchFilterObj.searchMaxPrice
    }

    if (!$scope.searchFilterObj.searchMinPrice) {
      $scope.searchFilterObj.searchMinPrice = 0
      searchMinPrice = 0
    } else {
      searchMinPrice = $scope.searchFilterObj.searchMinPrice
    }

    //setting medicaid
    if ($scope.searchFilterObj.searchMedicaid) {
      searchMedicaid = "Y"
    }

    //creating search obj to be passed into API
    var searchObj = {
      address: search,
      facilitytype: searchFacilityType,
      roomtype: searchRoomType,
      gender: searchGender,
      minprice: searchMinPrice,
      maxprice: searchMaxPrice,
      medicaid: searchMedicaid
    }

    console.log('searchObj', searchObj)
    //get new search results
    dataService.search('facility', searchObj).then(function (response) {
      // console.log(response)
      // console.log('search results', response)
      if (response.data.length === 0){ //no results found
        $scope.noResults = true;
      } else { //if results found, set facilities and build markers
        $scope.noResults = false;
        $scope.facilities = JSON.parse(JSON.stringify(response.data));
        //set search filter obj
        searchService.set({searchText: search, searchResult: response.data, searchFilterObj: $scope.searchFilterObj});
        // searchService.set({searchText: search, searchResult: response.data, searchType: searchType});
        // console.log($scope.facilities)

        //set compare arr if user is logged in
        if ($scope.user) {
          setCompareArr();
        }
        createHospitalArr();
        createImageLink()
        buildMarkers();
        buildHospitalMarker();
      }
    });
  };


  //add facility to be compared
  $scope.addToCompare = function (facility, index) {
    if (!$scope.user) { //if user not logged in
      $state.go('login'); //route to login page
    } else {
      $scope.facilities[index].compare = true;
      $scope.compareArr.push(facility.id);
    }
  };

  //remove facility from compare array
  $scope.removeFromCompare = function (facility, index) {
    $scope.facilities[index].compare = false;
    for (var i = 0; i < $scope.compareArr.length; i++) {
      if ($scope.compareArr[i] === facility.id) { //find facility to removed
        $scope.compareArr.splice(i,1); //remove from array
        break; //can stop looping if facility found
      }
    }
  };

  $scope.compareFacilities=function () {
    let compareArr = $scope.compareArr.join();

    let facilityObj = {
      userid: $scope.user.userid,
      facilityid: compareArr
    }

    dataService.add('preferredFacilities', facilityObj).then(function (response) {
      if (response.data.status === 'success') {
        $state.go('listingPreferred')
      } else {
        alert('Error.')
      }
    })
  }

  //route to list view of selected facility
  $scope.selectFacility = function (facility) {
    facilityService.set(facility);
    $state.go('listingView');
  };

  $scope.initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: initLat, lng: initLng },
        zoom: 11
    });
    buildInfowindow();
    buildMarkers();
    buildHospitalMarker();
  };

  function buildInfowindow() {
    //custom info box
    google.maps.event.addListener(infowindow, 'domready', function() {
      // Reference to the DIV that wraps the bottom of infowindow
      var iwOuter = $('.gm-style-iw');

       /* Since this div is in a position prior to .gm-div style-iw.
        * We use jQuery and create a iwBackground variable,
        * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
       */
      var iwBackground = iwOuter.prev();

      // Removes background shadow DIV
      iwBackground.children(':nth-child(2)').css({'display' : 'none'});

      // Removes white background DIV
      iwBackground.children(':nth-child(4)').css({'display' : 'none'});

      // Removes max width of title, set title to be 100% of infowindow
      iwOuter.children(':nth-child(1)').css({'max-height' : 'none', 'max-width':'0', 'width' : '100%'});

      // Removes the close button image
      iwOuter.next().css({'display' : 'none'});

      // Moves the infowindow 115px to the right.
      // iwOuter.parent().parent().css({left: '115px'});

      // Moves the shadow of the arrow 76px to the left margin.
      iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

      // Moves the arrow 76px to the left margin.
      iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

      // Changes the desired tail shadow color.
      iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

      // Reference to the div that groups the close button elements.
      // var iwCloseBtn = iwOuter.next();

      // Apply the desired effect to the close button
      // iwCloseBtn.css({opacity: '1', right: '45px', top: '5px', border: '0px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});
      // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
      // if($('.iw-content').height() < 140){
      //   $('.iw-bottom-gradient').css({display: 'none'});
      // }
    });
  }

  function buildHospitalMarker() {
    //hover over markers on map to open infowindow
    for (i = 0; i < $scope.hospitalArr.length; i++) {
      //create a marker for each facaility
      marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.hospitalArr[i].lat, $scope.hospitalArr[i].lng),
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/hospitals.png"
      });

      //create an array of these markers
      $scope.hospitalMarkerArr.push(marker);

      //mouseover on map markers to open infobox
      google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
          //get the specific info for each facility
          var content = getHospitalContent(i);
          //set the content to the infowindow
          infowindow.setContent(content[0]);
          //open the infowindow
          infowindow.open(map, marker);
        };
      })(marker, i));

      //close infobox on mouseout
      google.maps.event.addListener(marker, 'mouseout', (function (marker, i) {
        return function() {
          infowindow.close();
        };
      })(marker, i));
    }
  }

  function buildMarkers() {
    //setting number of markers to show
    if ($scope.facilities.length < 6) { //if facilities found is less than 6, then show all markers
      $scope.numMapMarkers = $scope.facilities.length;
      $scope.toggleShowAll = true;
    } else if (!$scope.toggleShowAll) { //if facilities found more than 6 and 'Map All' is false, show only 6 markers
      $scope.numMapMarkers = 6;
    } else { //if facilities found is more than 6 and 'Mapp All' is true, show all markers
      $scope.numMapMarkers = $scope.facilities.length
    }

    var latlng = [];

    //hover over markers on map to open infowindow
    for (i = 0; i < $scope.numMapMarkers; i++) {
      //create a marker for each facaility
      marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.facilities[i].lat, $scope.facilities[i].lng),
        map: map
      });

      //create an array of these markers
      $scope.markerArr.push(marker);

      //center map around markers
      let facilityLatLng = new google.maps.LatLng($scope.facilities[i].lat, $scope.facilities[i].lng);
      latlng.push(facilityLatLng);

      //click on map markers to open infobox
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          //get the specific info for each facility
          var content = getInfoContent(i);
          //set the content to the infowindow
          infowindow.setContent(content[0]);
          //open the infowindow
          infowindow.open(map, marker);
          addHighlightCardNoScroll(i);
        };
      })(marker, i));

      //mouseover on map markers to open infobox
      google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
          //get the specific info for each facility
          var content = getInfoContent(i);
          //set the content to the infowindow
          infowindow.setContent(content[0]);
          //open the infowindow
          infowindow.open(map, marker);
          addHighlightCard(i);
        };
      })(marker, i));

      //close infobox on mouseout
      google.maps.event.addListener(marker, 'mouseout', (function (marker, i) {
        return function() {
          infowindow.close();
          removeHighlightCard(i)

        };
      })(marker, i));
    }

    //function to trigger mouseover event on marker
    $scope.showInfo = function (facility, index) {
      google.maps.event.trigger($scope.markerArr[index], 'click');
    };

    //function to trigger mouseout event on marker
    $scope.hideInfo = function (facility, index) {
      google.maps.event.trigger($scope.markerArr[index], 'mouseout');
    };

    //center map around markers
    var latlngbounds = new google.maps.LatLngBounds();
    for (var i = 0; i < latlng.length; i++) {
      latlngbounds.extend(latlng[i]);
    }
    map.fitBounds(latlngbounds);
  }

  //set content of infowindow
  function getInfoContent(i) {
    var facility = $scope.facilities[i];
    var content = '<div id="iw-container" ng-click="viewFacility(' + i + ')">' +
             '<div class="iw-title">'+facility.name+'</div>' +
             '<div class="iw-content">' +
               '<img src="' + facility.smallPhotoLink + '" style="width:45%">' +
               '<div class="iw-subTitle">Total Beds: ' + facility.beds + '</div>' +

               '<p>' + facility.specialHmFeature + '</p>' +
               // '<p>Level 1 Price: $' + facility.level1Price + '<br>'+
               // 'Level 2 Price: $' + facility.level2Price + '</p>'+
             '</div>' +
             '<div class="iw-bottom-gradient"></div>' +
           '</div>';
    var compiled = $compile(content)($scope);
    return compiled;
  }

  //set hospital content info window
  function getHospitalContent(i) {
    var hospital = $scope.hospitalArr[i];
    var content = '<div id="iw-container" ng-click="viewFacility(' + i + ')">' +
             '<div class="iw-title">'+hospital.name+'</div>' +
             '<div class="iw-content">' +
               // '<img src="' + hospital.smallPhotoLink + '" style="width:45%">' +
               '<div class="iw-subTitle">City: ' + hospital.city + ', Zip: ' + hospital.zip + '</div>' +

               // '<p>' + hospital.specialHmFeature + '</p>' +
               // '<p>Level 1 Price: $' + facility.level1Price + '<br>'+
               // 'Level 2 Price: $' + facility.level2Price + '</p>'+
             '</div>' +
             '<div class="iw-bottom-gradient"></div>' +
           '</div>';
    var compiled = $compile(content)($scope);
    return compiled;
  }

  function addHighlightCard(i) {
    let cardId = "card-" + i
    let card = document.getElementById(cardId)
    card.scrollIntoView({behavior: "smooth"});
    card.scrollTop += 60;
    card.classList.add('highlight')
  }

  function addHighlightCardNoScroll(i){
    let cardId = "card-" + i
    let card = document.getElementById(cardId)
    card.classList.add('highlight')
  }

  function removeHighlightCard(i) {
    let cardId = "card-" + i
    let card = document.getElementById(cardId)
    card.classList.remove('highlight')
  }



  //toggle map markers
  $scope.toggleMapAll = function () {
    $scope.toggleShowAll = !$scope.toggleShowAll
    //clear all markers
    for (var i = 0; i < $scope.markerArr.length; i++) {
      $scope.markerArr[i].setMap(null);
    }
    $scope.markerArr.length=0;
    buildMarkers()
  }

  setSearch()
});
