app.service('Upload', function() {


  var upload = Upload.upload({
  url: '../images',
  data: {key: file, otherInfo: uploadInfo}
});

// returns a promise
upload.then(function(resp) {
  // file is uploaded successfully
  console.log('file ' + resp.config.data.file.name + 'is uploaded successfully. Response: ' + resp.data);
}, function(resp) {
  // handle error
  console.log('error')
}, function(evt) {
  // progress notify
  console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.data.file.name);
});
upload.catch(errorCallback);
upload.finally(callback, notifyCallback);
})
