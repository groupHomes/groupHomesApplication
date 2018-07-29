app.directive("room1", function() {
    return {
        restrict: "E",
        // scope: {
        //   // selected: "=",
        //   episode: '=',
        // },
        templateUrl: 'views/directives/room1/views/room1.html',
        link: function(scope, attrs) {
          //function loads when page loads
          console.log('room1')
          console.log(scope.numOfBedRoom1)
          // scope.room1={
          //   GENDER: scope.GENDER,
          //   TYPE: 'shared',
          //   VACANT: true,
          //   DATE: Date.now()
          // }
          // console.log(scope.room1)

        }

      }
});
