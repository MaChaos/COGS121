// models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our blog model
var imageSchema = mongoose.Schema({
    coverImg : {
      name: String,
      data: Buffer,
      contentType : String
    }

});

// methods ======================
// generating a hash

// create the model for users and expose it to our app
module.exports = mongoose.model('Image', imageSchema);
