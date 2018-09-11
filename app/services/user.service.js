app.factory('userService', function() {

  // var user;

  function set(data) {
    // selectedUser = data;
    console.log("set",JSON.stringify(data));

    sessionStorage.setItem('user', JSON.stringify(data));
    // console.log("set",data);
  }

  function get() {
    // if (selectedUser) {
      // return selectedUser;
    // }
    return JSON.parse(sessionStorage.getItem('user'));
  }

  function logout() {
    sessionStorage.clear();
  }

  return {
    set: set,
    get: get,
    logout: logout
  };
});
