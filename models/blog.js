// models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our blog model
var blogSchema = mongoose.Schema({

    owner            : {
        id      : String,
        username     : String,
    },
    title : String,
    time : String,
    content : String,
    places : {
      name: String,
    }

});

// methods ======================
// generating a hash

// create the model for users and expose it to our app
module.exports = mongoose.model('Blog', blogSchema);
