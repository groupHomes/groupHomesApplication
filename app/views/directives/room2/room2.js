app.directive("room2", function() {
    return {
        restrict: "E",
        // scope: {
        //   // selected: "=",
        //   episode: '=',
        // },
        templateUrl: 'views/directives/room2/views/room2.html',
        link: function(scope, attrs) {
          console.log('room2')
        }

      }
});
