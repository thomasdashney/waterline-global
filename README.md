Waterline-Global
================

Utility to ease the use of Waterline ORM across an application. It hooks into your `models/` directory and pulls in all of your models.

Installation
----------
```bash
npm install --save git://github.com/thomasdashney/waterline-global
```
Usage
----------
When starting the server:

```javascript
var waterline = require('waterline-global');

var config = {
  // regular waterline config...
};

waterline.initialize(dbConfig, function(err) {
  if (err)
    // handle error
});
```

Define your models in `models/`. These will be automatically pulled in and used by waterline.

```javascript
module.exports = {
  identity: 'user',
  connection: 'myconnection',
  
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      email: true
    },
    password: {
      required: true,
      type: 'string'
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    birthdate: {
      type: 'date'
    }
  }
};

```

You can now access the ORM and query your models from anywhere in your application.

For example, in a route:

```javascript
var db = require('waterline-global');

// express route
get('/users', req, res) {
  var user = db.models.user;
  user.find().exec(function foundUsers(err, users) {
  	res.send(users);
  });
}

```

Options
--------
You can define custom options when initializing the database.

* modelsDir
	* Set this to the __absolute__ path of the directory that you want to store your models. If not set, waterline-global will load model files from the `models/` directory in the same directory as the node file being run.
