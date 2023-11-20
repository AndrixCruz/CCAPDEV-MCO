const { Schema, SchemaTypes, model } = require('mongoose');

const profileSchema = new Schema({
    Name: String,
    username: String,
    email: String,
    password: String,
});

const Profile = model('Profile', profileSchema);

module.exports = Profile;
