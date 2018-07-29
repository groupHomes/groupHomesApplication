app.factory('userService', function() {

  var selectedUser;

  function set(data) {
    selectedUser = data;
    console.log("set",selectedUser);

    // localStorageService.set('selStudent', data);
    // console.log("set",data);
  }

  function get() {
    // if (selectedUser) {
      return selectedUser;
    // }
    // return localStorageService.get('selStudent');
  }

  return {
    set: set,
    get: get,
  };
});
