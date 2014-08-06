/**
 * database.js
 *
 * provides routes with access to our orm
 * *** initialize() must be called when server is run to set everything up
 */

var Waterline   = require('waterline');
var async       = require('async');
var fs          = require('fs');
var path        = require('path');

// will be populated with our connections
exports.connections = null;
// will be populated with our models
// usage: models.{model}.find().exec() 
// etc..
exports.models = null;

/**
 * [This function must be called to initialize waterline]
 * @param  {Object}   config [waterline configuration]
 * @param  {Function} cb     [callback(err)]
 */
exports.initialize = function(config, callback) {

  var projectDir = path.dirname(require.main.filename);

  var orm = new Waterline();

  // bootload all of our models
  fs.readdir(projectDir + '/models', function(err, files) {
    if (err)
      return callback('error reading files: ' + err);

    async.each(files, function(filename, cb) {
      var filePath = projectDir + '/models/' + filename;
      var fileExtension = path.extname(filename);
      // if not .js file, don't process file
      if (fileExtension !== '.js') 
        return cb();
      var name = path.basename(filePath, '.js');

      // load module
      var model = require(filePath);

      // create a collection and add to orm
      var collection = Waterline.Collection.extend(model);
      orm.loadCollection(collection);

      // call the callback
      cb();
    }, function (err) {
      if (err)
        return cb('error loading models: ' + err);

      orm.initialize(config, function(err, data) {
        exports.models = data.collections;
        exports.connections = data.connections;

        return callback();
      });
    });
  });
}