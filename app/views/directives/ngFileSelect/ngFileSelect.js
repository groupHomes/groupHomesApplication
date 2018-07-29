app.directive("ngFileSelect", function(fileReader, $timeout) {

  // return {
  //     restrict: 'A',
  //     link: function(scope, element, attrs) {
  //         var model = $parse(attrs.ngFileSelect);
  //         var modelSetter = model.assign;
  //
  //         element.bind('change', function(){
  //             scope.$apply(function(){
  //                 modelSetter(scope, element[0].files[0]);
  //             });
  //         });
  //     }
  // };
    return {
      scope: {
        ngModel: '='
      },
      link: function($scope, el) {
        function getFile(file) {
          fileReader.readAsDataUrl(file, $scope)
            .then(function(result) {
              $timeout(function() {
                console.log(result)
                $scope.ngModel = result;
              });
            });
        }

        el.bind("change", function(e) {
          var file = (e.srcElement || e.target).files[0];
          getFile(file);
        });
      }
    };
  });
