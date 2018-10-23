app.service('dataService', function($http, $q, CONSTANTS, $httpParamSerializerJQLike) {
  var base = CONSTANTS.api.baseUrl;
  var path = CONSTANTS.api.path;
  var query = CONSTANTS.api.query;

  var service = {};

  service.add = function(dataType, dataObj) {
    var action = CONSTANTS.api.actions[dataType].add;
    // var deferred = $q.defer();
    return $http({
      url: base + path + query + action,
      method: 'POST',
      data: $httpParamSerializerJQLike(dataObj),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  };

  service.get = function(dataType, dataObj) {
    var action = CONSTANTS.api.actions[dataType].get;
    // var deferred = $q.defer();
    return $http({
      url: base + path + query + action,
      method: 'GET',
      params: dataObj,
      paramSerializer: '$httpParamSerializerJQLike'
    });
  };

  service.getAll = function(dataType, dataObj) {
    var action = CONSTANTS.api.actions[dataType].getAll;
    // var deferred = $q.defer();
    return $http({
      url: base + path + query + action,
      method: 'GET',
      params: dataObj,
      paramSerializer: '$httpParamSerializerJQLike'
    });
  };

  service.edit = function(dataType, dataObj) {
    var action = CONSTANTS.api.actions[dataType].edit;
    return $http({
      url: base + path + query + action,
      method: 'POST',
      data: $httpParamSerializerJQLike(dataObj),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  };

  service.delete = function(dataType, dataObj) {
  var action = CONSTANTS.api.actions[dataType].delete;
  var deferred = $q.defer();
  $http({
    url: base + path + query + action,
    method: 'POST',
    data: $httpParamSerializerJQLike(dataObj),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).success (function(data) {
    deferred.resolve(data);
  }).error(function(error) {
    deferred.reject();
  });
  return deferred.promise;
};


  // service.edit = function(dataType, dataObj) {
  //   var action = CONSTANTS.api.actions[dataType].edit;
  //   var deferred = $q.defer();
  //   $http({
  //     url: base + path + query + action,
  //     method: 'POST',
  //     data: $httpParamSerializerJQLike(dataObj),
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }
  //   }).success (function(data) {
  //     deferred.resolve(data);
  //   }).error(function(error) {
  //     deferred.reject();
  //   });
  //   return deferred.promise;
  // };

  // service.user = function(dataType, dataObj) {
  //   var action = CONSTANTS.api.actions[dataType].loginUser;
  //   // var deferred = $q.defer();
  //   return $http({
  //     url: base + path + query + action,
  //     method: 'GET',
  //     params: dataObj,
  //     paramSerializer: '$httpParamSerializerJQLike'
  //   });
  // };

  service.search = function(dataType, dataObj) {
    var action = CONSTANTS.api.actions[dataType].search;
    //var deferred = $q.defer();
    return $http({
      url: base + path + query + action,
      method: 'GET',
      params: dataObj,
      paramSerializer: '$httpParamSerializerJQLike'
    });
  };

    /**
   * Upload a file, either for patients or for employees currently
   * @param  {string} dataType "patUpload"|"empUpload"
   * @param  {FormData} dataObj  the FormData object to be sent
   * @return {promise}          the promise object for the request
   */
  service.uploadFile = function(dataType, dataObj) {
    var action = CONSTANTS.api.actions[dataType].add;
    console.log('dataobj', dataObj)
    console.log("action: " + action);
    console.log("url: " + base + path + query + action);
    var promise = $http({
      url: base + path + query + action,
      method: 'POST',
      data: dataObj,
      headers: {
        // If content-type is undefined, the browser assigns the boundaries
        'Content-Type': undefined
      },
      // Prevent serializing
      transformRequest: angular.identity
    });
    return promise;
  }

  return service;
});
