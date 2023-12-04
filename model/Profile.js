const { Schema, SchemaTypes, model } = require('mongoose');
const internal = require('stream');


const profileSchema = new Schema({
    Name: String,
    username: String,
    email: String,
    AboutMe: String,
    Age: String,
    Gender: String,
    Food: String,
    password: String,
    
});

const Profile = model('Profile', profileSchema);

module.exports = Profile;
