app.factory('facilityService', function() {

  function set(data) {
    selectedFacility = data;
    console.log("set",selectedFacility);

    // localStorageService.set('selStudent', data);
    // console.log("set",data);
  }

  function get() {
    return selectedFacility;
    // return localStorageService.get('selStudent');
  }

  return {
    set: set,
    get: get,
  };
});
