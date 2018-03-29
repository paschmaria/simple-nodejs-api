var mongoose = require('mongoose');

// Define the Schema Object
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
// Define a User Schema
var UserSchema = new Schema({
	id: ObjectId,
	first_name: String,
	last_name: String,
	email_address: String,
	career: String
});

// In order to access the model, define a new variable (UserModel) that will model a "users" collection created in the mLab database.
var UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;