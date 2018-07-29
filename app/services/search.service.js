app.factory('searchService', function() {

  function set(data) {
    selectedSearch = data;
    console.log("set", selectedSearch);

    // localStorageService.set('selStudent', data);
    // console.log("set",data);
  }

  function get() {
    return selectedSearch;
    // return localStorageService.get('selStudent');
  }

  return {
    set: set,
    get: get,
  };
});
