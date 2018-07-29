app.controller('ListingIndexController', function($scope, dataService, CONSTANTS) {

  //get all listings for user
  $scope.files=[
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=1",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=2",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=3",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=4",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=5",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=6",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=7",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=8",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=9",
    "http://52.37.19.44/examApp/api.php?x=getPatientUploadFile&KEYID=10",

  ]
});
