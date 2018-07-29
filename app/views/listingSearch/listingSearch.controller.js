app.controller('ListingSearchController', function($scope, dataService, CONSTANTS, $window, $compile, $state, facilityService, userService, searchService) {

  //set user to scope
  $scope.user = userService.get();

  //set search result
  $scope.search = searchService.get();
  $scope.facilities = $scope.search.searchResult;
  $scope.searchText = $scope.search.searchText;


  //get all listingView
  // dataService.getAll('facility').then(function (response) {
  //   console.log(response);
  //   $scope.facilities=response.data;
  //   //testing search
  //   // var address = $scope.facilities[0].address + $scope.facilities[0].city + $scope.facilities[0].state + $scope.facilities[0].zip;
  //   // dataService.search('facility', address).then(function (response) {
  //   //   console.log(response)
  //   // })
  // });

  //search for facility
  $scope.submit = function (search) {
    dataService.search('facility', {address:search}).then(function (response) {
      if (response.data.length === 0){ //no results found
        $scope.noResults = true;
        $scope.facilities = [];
      } else {
        $scope.noResults = false;
        $scope.facilities = response.data;
      }
    });
  };

  //create array of selected facilities to be compared
  $scope.compareArr = [];

  //add facility to be compared
  $scope.addToCompare = function (facility, index) {
    console.log('add facility to compare', facility);
    $scope.compare[index] = true;
    //if nothing in compare array, then add facility
    if ($scope.compareArr.length === 0) {
      $scope.compareArr.push(facility);
    } else { //else add to compare array
      $scope.compareArr.push(facility);
    }
  };

  //remove facility from compare array
  $scope.removeFromCompare = function (facility, index) {
    console.log('remove facility from compare', facility);
    $scope.compare[index] = false;
    for (var i = 0; i < $scope.compareArr.length; i++) {
      if ($scope.compareArr[i] === facility) { //find facility to removed
        $scope.compareArr.splice(i,1); //remove from array
        break; //can stop looping if facility added
      }
    }
  };

  //send array of facilities to be compared
  $scope.compare = function () {
    console.log($scope.compareArr);
    if ($scope.user === undefined) { //if user not logged in
      $state.go('login'); //route to login page
    } else {
      //NEED API TO SEND COMPARE ARRAY
    }
  };

  //route to list view of selected facility
  $scope.selectFacility = function (facility) {
    facilityService.set(facility);
    $state.go('listingView');
  };


  //route to listing view page; set selected facility
  $scope.viewFacility=function (i) {
    console.log('view facility', $scope.facilities[i]);
    facilityService.set($scope.facilities[i]);
    $state.go('listingView');
  };


  ////////////////////GOOGLE MAPS///////////////////////////////
  var map;
  var marker;
  var layerHospital;
  var layerResidential;
  var layerPersonal;
  var layerDrugAlcohol;
  var layerADC;
  var layerDVPNSP;
  var layerDialysis;
  var layerOthers;
  var circle, circlemarker;
  var initLat = 36.1699; //36.13842925; //36.125541;
  var initLng = -115.1398; //-115.1717376708;
  var initDistance = 15;
  var FacilityAllTable = "1kkN0paFz4_KF_mMw0A1wSjr9CfiA5ohvBCgRQijY"; //"1tLrXcHFJSeBIQidORougpBuRF_HGiXbOJwsXH_YA"; //"1bAQPd8rlrO8jItgP07MhwqM3wX8Vg58OoHDpo02f";  //All Nevada Nursing Homes <-- Table Name
  var userKey = "AIzaSyDsWy4Qwn4FJ4iQ8Ufr-GM1FQssMxG1msY";  //"AIzaSyB9I2qkvtn821Tc7cGJ5v9JoX8AUiv6SUw";
  //var hospitalTable = "1tMnZ8T6L8jFhfxKoVoKYHV3M-j5P7oWmubpCCw-l";
  var Layer1 = "1zjYA7Xnf_a8cKLge6zZ5DEmgFxcvKCP_-Rvau_oX";
  var Layer2 = "1Uti6_8cBvHt5J29rK-OV88bQt7LzyaqqNJDS78K4";
  var Layer3 = "1P41LGCcnVmr42ZEx3QFDVSs857KwJQ7h6GCctLws";
  var Layer4 = "1cR3u3xfyE161GLziONUWgFeScQer4TRjvHpnwhdg";
  var Layer5 = "1gtklv0kmSQB4vZoWQTAWfNXcLAYOws65V9y-odCy";
  var Layer6 = "1LrXM4L55EuI0di2VSDiJQEpyYI8tksDXSR4LqQcR";
  var Layer7 = "1Luc7yAyvhmIKn8PLodIThRauY-13Exls4g7xaBho";
  var Layer8 = "1Fvpw0RKetEveZzOputgL_L-NJBrbADHNS6hSll30";
  var AutoComplete;

  $scope.initMap = function () {
    console.log('loading map');

    var infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: initLat, lng: initLng },
        zoom: 11
    });

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

    $scope.markerArr = [];

    //hover over markers on map to open infowindow
    for (i = 0; i < $scope.facilities.length; i++) {
      //create a marker for each facaility
      marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.facilities[i].lat, $scope.facilities[i].lng),
        map: map
      });

      //create an array of these markers
      $scope.markerArr.push(marker);

      //center map around markers
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(marker.position);

      //mouseover on map markers to open infobox
      google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
          //get the specific info for each facility
          var content = getInfoContent(i);
          //set the content to the infowindow
          infowindow.setContent(content[0]);
          //open the infowindow
          infowindow.open(map, marker);
        };
      })(marker, i));

      //close infobox on mouseout
      // google.maps.event.addListener(marker, 'mouseout', (function (marker, i) {
      //   return function() {
      //     infowindow.close();
      //   };
      // })(marker, i));

      //route to facility on click on marker
      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function() {
          $scope.viewFacility(i)
        };
      })(marker, i));
    }

    //function to trigger mouseover event on marker
    $scope.showInfo = function (facility, index) {
      google.maps.event.trigger($scope.markerArr[index], 'mouseover');
    };

    //function to trigger mouseout event on marker
    $scope.hideInfo = function (facility, index) {
      google.maps.event.trigger($scope.markerArr[index], 'mouseout');
    };
  };


  //set content of infowindow
  function getInfoContent(i) {
    // console.log(i)
    // console.log($scope.test)
    // console.log($scope.facilities[i])
    var facility = $scope.facilities[i];
    var content = '<div id="iw-container" ng-click="viewFacility(' + i + ')">' +
             '<div class="iw-title">'+facility.name+'</div>' +
             '<div class="iw-content">' +
               '<img src="http://18.236.125.242/groupHomes/photos/' + facility.id + '/' + facility.smallPhoto + '" style="width:45%">' +
               '<div class="iw-subTitle">'+facility.address+ ', ' +facility.city+', '+facility.state+', '+facility.zip+'</div>' +
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

  $scope.initMap();
});
